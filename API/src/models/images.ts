import Image from '@/database/models/Image';
import Reaction from '@/database/models/Reaction';
import Comment from '@/database/models/Comment';
import User from '@/database/models/User';
import { Op, or } from 'sequelize';

export default class ImageModel {

	create = async (image) => {
		return await Image.create(image);
	}

	get = async (owner_id: string) => {
		return await Image.findAll({
			where: {
				owner_id
			},
			raw: true
		});
	}

	delete = async (owner_id: string, key: string) => {
		return await Image.destroy({
			where: {
				owner_id,
				key
			},
			limit: 1
		});
	}

	findById = async (key: string) => {
		return await Image.findOne({
			where: {
				key
			},
			include: [Reaction, User]
		});
	}

	getLatest = async () => {
		return await Image.findAll({
			limit: 10,
			order: [['updatedAt', 'DESC']]
		});
	}

	find = async (query: string) => {
		return await Image.findAll({
			where: or(
				{
					tags: {
						[Op.contains]: [query]
					}
				},
				{
					description: {
						[Op.iLike]: '%' + query + '%'
					}
				}, {
					title: {
						[Op.iLike]: '%' + query + '%'
					}
				}),
				include: [Reaction, User]
		});
	}

	findByTag = async (query: string) => {
		return await Image.findAll({
			where: {
					tags: {
						[Op.contains]: [query]
					}
				},
			include: [Reaction, User]
		});
	}

	findByDesc = async (query: string) => {
		return await Image.findAll({
			where: {
				description: {
					[Op.iLike]: '%' + query + '%'
				}
			},
			include: [Reaction, User]
		});
	}

	findWithOwner = async (key: string, owner_id: string) => {
		return await Image.findOne({
			where: {
				key,
				owner_id
			},
			include: [Reaction, User]
		});
	}

	update = async (params) => {
		const key = params.id;
		const owner_id = params.user;
		await Image.update({
			title: params.title,
			description: params.description,
			tags: params.tags,
			owner: params.owner,
			owner_id
		}, {
			where: {
				key,
				owner_id
			}
		});
		return await this.findWithOwner(key, owner_id);
	}
}