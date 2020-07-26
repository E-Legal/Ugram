import { cbType } from '@/lib/types';
import { IAuth, INauth } from '@/lib/interfaces';
import { p, generateAccessToken, createGoogleToken } from '@/lib/utils';
import { UserModel, NotificationModel } from '@/models/';
import { compareSync, hashSync } from 'bcryptjs';

import * as uuid from 'uuid/v4';

class UserController {

	private model: UserModel;
	private notifModel: NotificationModel;

	constructor() {
		this.model = new UserModel();
		this.notifModel = new NotificationModel();
	}

	register = async (params: INauth, callback: cbType) => {
		let [err, user] = await p(this.model.findByEmail(params.email));
		if (err || user)
			return callback({ code: 400, message: 'Email already used' });
		const creation_date = new Date();
		params.password = await hashSync(params.password, 10);
		const id = uuid();
		[err, user] = await p(this.model.create({ ...params, creation_date, id }));
		if (err || !user)
			return callback({ code: 400, message: 'Failed to create user' });
		return callback(null, { code: 201, data: 'User created' });
	}

	loginGoogle = async (params: INauth, callback: cbType) => {
		const gToken = await createGoogleToken(params);
		let access_token;
		let [err, user] = await p(this.model.findByToken(gToken));
		if (err)
			return callback({ code: 400, message: err.message });
		if (user) {
			access_token = generateAccessToken(user.id);
			return callback(null, { code: 200, data: { id: user.id, token: access_token } });
		}
		[err, user] = await p(this.registerGoogle(params, gToken));
		if (err || !user)
			return callback({ code: 400, message: 'Failed to create user' });
		access_token = generateAccessToken(user.id);
		return callback(null, { code: 200, data: { id: user.id, token: access_token } });
	}

	login = async (params: INauth, callback: cbType) => {
		const [err, user] = await p(this.model.findByEmail(params.email));
		if (err || !user)
			return callback({ code: 401, message: 'User not found or wrong password' });
		if (!compareSync(params.password, user.password))
			return callback({ code: 401, message: 'User not found or wrong password' });
		const access_token = generateAccessToken(user.id);
		return callback(null, { code: 200, data: { id: user.id, token: access_token } });
	}

	getProfile = async (params: IAuth, callback: cbType) => {
		const [err, user] = await p(this.model.findById(params.id, false));
		if (err || !user)
			return callback({ code: 400, message: 'User not found' });
		return callback(null, { code: 200, data: user });
	}

	updateProfile = async (params: IAuth, callback: cbType) => {
		let [err, user] = await p(this.model.findByEmail(params.email));
		const [e, u] = await p(this.model.findById(params.user));
		if (e || err || user && user.email !== u.email)
			return callback({ code: 400, message: 'Email already used' });
		[err, user] = await p(this.model.update(params));
		if (err || !user)
			return callback({ code: 400, message: 'User not found' });
		return callback(null, { code: 200, data: user });
	}

	getUsers = async (params: IAuth, callback: cbType) => {
		const [err, users] = await p(this.model.getUsers());
		if (err || !users)
			return callback({ code: 400, message: 'No users found' });
		return callback(null, { code: 200, data: users });
	}

	search = async (params: IAuth, callback: cbType) => {
		const [err, users] = await p(this.model.search(params.q));
		if (err)
			return callback({ code: 400, message: 'Error while looking for users' });
		return callback(null, { code: 200, data: users });
	}

	getUserById = async (params: IAuth, callback: cbType) => {
		return callback(null, { code: 200, data: 'User created' });
	}

	getImages = async (params: IAuth, callback) => {
		const [err, images] = await p(this.model.getImages(params.user));
		if (err)
			return callback({ code: 400, message: 'Error while looking for the images' });
		return callback(null, { code: 200, data: images });
	}

	deleteUser = async (params: IAuth, callback: cbType) => {
		const [err, res] = await p(this.model.deleteUser(params.user));
		if (err || !res)
			return callback({ code: 400, message: 'Failed to delete user' });
		return callback(null, { code: 204, data: 'No Content' });
	}

	getNotifications = async (params: IAuth, callback: cbType) => {
		const [err, notifs] = await p(this.notifModel.find(params.user));
		if (err)
			return callback({ code: 400, message: err.message });
		return callback(null, { code: 200, data: notifs });
	}

	private registerGoogle = async (user, gToken) => {
		const id = uuid();
		const creation_date = new Date();
		user.password = await hashSync(user.token, 10);
		return await this.model.createGoogle({ ...user, creation_date, id, google_token: gToken });
	}
}

const controller = new UserController();

export default controller;