import { cbType } from '@/lib/types';
import { IAuth } from '@/lib/interfaces';
import { p } from '@/lib/utils';
import { UserModel, ImageModel, ReactionModel, CommentModel, TagModel } from '@/models/';

import { Request } from 'express';

import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import * as path from 'path';

import * as uuid from 'uuid/v4';

import * as formidable from 'formidable';

const TMP_DIR = process.env.TMP ? process.env.TMP + '/' : '/tmp/';

const BUCKET = 'ugram14-images';

class ImageController {

	private tagModel: TagModel;
	private model: UserModel;
	private imageModel: ImageModel;
	private reactionModel: ReactionModel;
	private commentModel: CommentModel;
	private s3: AWS.S3;

	constructor() {
		this.model = new UserModel();
		this.imageModel = new ImageModel();
		this.reactionModel = new ReactionModel();
		this.commentModel = new CommentModel();
		this.tagModel = new TagModel();
		AWS.config.update({
			region: 'us-west-2',
			accessKeyId: process.env.ACCESS_KEY_ID,
			secretAccessKey: process.env.SECRET_ACCESS_KEY
		});
		this.s3 = new AWS.S3();
	}

	add = async (req: Request, callback: cbType) => {
		let [e, r] = await p(this.download(req));
		if (e)
			return callback({ code: 400, message: e.message });
		if (process.env.NODE_ENV === 'test') {
			const key = r.substring(TMP_DIR.length);
			[e, r] = await p(this.model.addImage(req.body.user, req.query, { key, url: r }));
			this.addTagsToList(req.query.tags);
			return callback(null, { code: 200, data: r });
		}
		[e, r] = await p(this.uploadToS3(r));
		if (e)
			return callback({ code: 400, message: e.message });
		[e, r] = await p(this.model.addImage(req.body.user, req.query, { key: r.key, url: r.Location }));
		if (e)
			return callback({ code: 400, message: e.message });
		this.addTagsToList(req.query.tags);
		return callback(null, { code: 200, data: r });
	}

	findById = async (params: IAuth, callback: cbType) => {
		const [err, img] = await p(this.imageModel.findById(params.id));
		if (err || !img)
			return callback({ code: 400, message: 'Image not found' });
		const [e, comments] = await p(this.commentModel.find(params.id));
		if (e)
			return callback({ code: 400, message: 'Error while getting the comments' });
		img.comments = comments;
		const retObj = {
			...img.dataValues,
			comments
		};
		return callback(null, { code: 200, data: retObj });
	}

	delete = async (params: IAuth, callback: cbType) => {
		const key = params.id;
		if (process.env.NODE_ENV === 'test') {
			try {
				await fs.unlinkSync(`${TMP_DIR}${key}`);
			} catch (e) {
				return callback({ code: 400, message: e });
			}
		} else {
			const [e, ] = await p(this.deleteFromS3(key));
			if (e)
				return callback({ code: 400, message: e.message });
		}
		const [err, res] = await p(this.model.deleteImage(params.user, key));
		if (err)
			return callback({ code: 400, message: err });
		return callback(null, { code: 203, data: 'OK' });
	}

	update = async (params: IAuth, callback: cbType) => {
		const [_, owner] = await p(this.model.findById(params.id));
		let [err, img] = await p(this.imageModel.findById(params.id));
		if (err || !img)
			return callback({ code: 404, message: `Image ${params.id} not found` });
		[err, img] = await p(this.imageModel.update({ ...params, owner }));
		if (err || !img)
			return callback({ code: 400, message: `Failed to update image ${params.id}` });
		return callback(null, { code: 200, data: img });
	}

	getLatest = async (params: IAuth, callback: cbType) => {
		const [err, imgs] = await p(this.imageModel.getLatest());
		if (err)
			return callback({ code: 400, message: 'Failed to search images' });
		return callback(null, { code: 200, data: imgs });
	}

	search = async (params: IAuth, callback: cbType) => {
		const [err, imgs] = await p(this.imageModel.find(params.q));
		if (err)
			return callback({ code: 400, message: 'Failed to search images' });
		return callback(null, { code: 200, data: imgs });
	}

	searchByDescription = async (params: IAuth, callback: cbType) => {
		const [err, imgs] = await p(this.imageModel.findByDesc(params.q));
		if (err)
			return callback({ code: 400, message: 'Failed to search images' });
		return callback(null, { code: 200, data: imgs });
	}

	searchByTag = async (params: IAuth, callback: cbType) => {
		const [err, imgs] = await p(this.imageModel.findByTag(params.q));
		const [e, r] = await p(this.tagModel.increment(params.q));
		if (err)
			return callback({ code: 400, message: 'Failed to search images' });
		return callback(null, { code: 200, data: imgs });
	}

	getTags = async (params: IAuth, callback: cbType) => {
		const [err, tags] = await p(this.tagModel.findPopular());
		if (err)
			return callback({ code: 400, message: err.message });
		return callback(null, { code: 200, data: tags });
	}

	suggestTags = async (params: IAuth, callback: cbType) => {
		const [err, tags] = await p(this.tagModel.findLike(params.q || ''));
		if (err)
			return callback({ code: 400, message: err.message });
		return callback(null, { code: 200, data: tags });
	}

	addTagsToList = (tags: string[]) => {
		tags.forEach((tag) => {
			this.tagModel.increment(tag);
		});
	}

	react = async (params: IAuth, callback: cbType) => {
		const [err, img] = await p(this.imageModel.findById(params.id));
		if (err)
			return callback({ code: 400, message: 'Image not found' });
		if (await this.reactionModel.find(params.id, params.user))
			return callback({ code: 400, message: 'Reaction already exists' });
		const [e, ] = await p(this.reactionModel.create({
			image: img,
			image_key: img.key,
			type: 'like',
			owner_id: params.user
		}));
		if (e)
			return callback({ code: 400, message: e.message });
		const [nError, notif] = await p(this.model.notify(params.user, img.owner, img, 'reaction'));
		if (nError || !notif)
			return callback(null, { code: 400, data: 'Notification could not be created' });
		return callback(null, { code: 200, data: 'OK' });
	}

	removeReact = async (params: IAuth, callback: cbType) => {
		const [e, res] = await p(this.reactionModel.delete(params.id, params.user));
		if (e || !res || res === 0)
			return callback({ code: 400, message: 'Image not found' });
		return callback(null, { code: 200, data: 'OK' });
	}

	comment = async (params: IAuth, callback: cbType) => {
		const [err, img] = await p(this.imageModel.findById(params.id));
		if (err)
			return callback({ code: 400, message: 'Image not found' });
		const id = uuid();
		const [ , user] = await p(this.model.findByToken(params.user));
		const [e, comment] = await p(this.commentModel.create({
			image: img,
			image_key: img.key,
			text: params.text,
			id,
			owner_id: params.user,
			user
		}));
		if (e || !comment)
			return callback({ code: 400, message: e.message });
		const [nError, notif] = await p(this.model.notify(params.user, img.owner, img, 'comment'));
		if (nError || !notif)
			return callback(null, { code: 400, data: 'Notification could not be created' });
		return callback(null, { code: 200, data: comment });
	}

	updateComment = async (params: IAuth, callback: cbType) => {
		const [err, res] = await p(this.commentModel.update(params.id, params.user, params.text));
		if (err || !res)
			return callback({ code: 400, message: 'Image not found' });
		return callback(null, { code: 200, data: res[1][0] });
	}

	removeComment = async (params: IAuth, callback: cbType) => {
		const [err, res] = await p(this.commentModel.delete(params.id, params.user, params.comment_id));
		if (err || res === 0)
			return callback({ code: 400, message: 'Image not found' });
		return callback(null, { code: 200, data: 'OK' });
	}

	private download = async (req) => {
		const form = new formidable.IncomingForm();
		return new Promise((resolve, reject) => {
			form.parse(req, (err, fields, { file }) => {
				if (err || !file)
					return reject(err);
				return resolve(file.path);
			});
		});
	}

	private uploadToS3 = async (file: string) => {
		return new Promise((resolve, reject) => {
			const fileStream = fs.createReadStream(file);
			fileStream.on('error', (e) => {
				return reject(e);
			});
			const uploadParams = {
				Bucket: BUCKET,
				Body: fileStream,
				Key: path.basename(file),
				ACL: 'public-read'
			};
			this.s3.upload(uploadParams, (err, data) => {
				if (err)
					return reject(err);
				return resolve(data);
			});
		});
	}

	private deleteFromS3 = async (key: string) => {
		return new Promise((resolve, reject) => {
			const deleteParams = {
				Bucket: BUCKET,
				Key: key
			};
			this.s3.deleteObject(deleteParams, (err, data) => {
				if (err)
					return reject(err);
				return resolve(data);
			});
		});
	}
}

const controller = new ImageController();

export default controller;