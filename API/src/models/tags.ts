import Tag from '@/database/models/Tag';
import { literal, Op } from 'sequelize';

export default class {

	create = async (name: string) => {
		return Tag.create({
			name,
			count: 0
		});
	}

	increment = async (name: string) => {
		const t = await this.find(name);
		if (!t || t.length === 0)
			await this.create(name);
		return Tag.update({
			count: literal('count + 1')
		}, {
			where: {
				name
			}
		});
	}

	find = async (name: string) => {
		return Tag.findAll({
			where: {
				name
			}
		});
	}

	findLike = async (name: string) => {
		return Tag.findAll({
			where: {
				name: {
					[Op.iLike]: name + '%'
				}
			}
		});
	}

	findPopular = async () => {
		return Tag.findAll({
			limit: 10,
			order: [['count', 'DESC']]
		});
	}
}