import User from '@/database/models/User';
import Image from '@/database/models/Image';
import Reaction from '@/database/models/Reaction';
import { p } from '@/lib/utils';
import ImageModel from './images';
import NotificationModel from './notifications';

import { Op, or } from 'sequelize';

export default class UserModel {

	private ImageModel: ImageModel;
	private NotifModel: NotificationModel;

	constructor() {
		this.ImageModel = new ImageModel();
		this.NotifModel = new NotificationModel();
	}

	findByEmail = async (email: string) => {
		return await User.findOne({
			where: {
				email
			},
			raw: true,
			attributes: [
				'id', 'name', 'last_name', 'username', 'email', 'phone_number', 'password'
			]
		});
	}

	findByToken = async (token: string) => {
		return await User.findOne({
			where: {
				google_token: token
			},
			raw: true,
			attributes: [
				'id', 'name', 'last_name', 'username', 'email', 'phone_number', 'password', 'google_token'
			]
		});
	}

	create = async (user) => {
		return await User.create({
			username: user.username,
			name: user.name,
			last_name: user.last_name,
			email: user.email,
			password: user.password,
			phone_number: user.phone_number,
			id: user.id,
			images: []
		});
	}

	createGoogle = async (user) => {
		return await User.create({
			username: user.username,
			name: user.name,
			last_name: user.last_name,
			email: user.email,
			password: user.password,
			google_token: user.google_token,
			id: user.id,
			images: []
		});
	}

	findById = async (id: string, raw: boolean = true) => {
		return await User.findOne({
			where: {
				id
			},
			raw,
			attributes: [
				'id', 'name', 'last_name', 'username', 'email', 'phone_number', 'created_at'
			],
			include: [Image, Reaction]
		});
	}

	update = async (user) => {
		await User.update({
			name: user.name,
			last_name: user.last_name,
			email: user.email,
			phone_number: user.phone_number,
			username: user.username
		}, { where: { id: user.user }});
		return await this.findById(user.user, false);
	}

	getUsers = async () => {
		return await User.findAll({
			raw: true,
			attributes: [
				'id', 'name', 'last_name', 'username', 'email', 'phone_number', 'created_at'
			]
		});
	}

	search = async (query) => {
		return await User.findAll({
			where: or(
				{
					username: {
						[Op.iLike]: query + '%'
					}
				},
				{
					name: {
						[Op.iLike]: query + '%'
					}
				}
			),
			raw: true,
			attributes: [
				'id', 'name', 'last_name', 'username', 'email', 'phone_number'
			]
		});
	}

	deleteUser = async (id) => {
		return await User.destroy({
			where: {
				id
			}
		});
	}

	addImage = async (user_id, params, { key, url }) => {
		const [, user] = await p(this.findById(user_id, false));
		return await this.ImageModel.create({
			key,
			url,
			owner: user,
			owner_id: user_id,
			description: params.description,
			title: params.title,
			tags: params.tags,
			reactions: [],
			comments: []
		});
	}

	getImages = async (user) => {
		return await this.ImageModel.get(user);
	}

	deleteImage = async (user_id, key) => {
		return await this.ImageModel.delete(user_id, key);
	}

	// user = person who likes the image
	// owner = person whose image was liked
	notify = async (user_id: string, owner, img, action: string) => {
		const [ , user] = await p(this.findById(user_id));
		return new Promise(async (resolve, reject) => {
			const [e, notif] = await p(this.NotifModel.create({
				username: user.username,
				owner,
				image: img.title,
				owner_id: owner.id,
				action
			}));
			if (e || !notif)
				return reject('Notification could not be created');
			return resolve(notif);
		});
	}
}