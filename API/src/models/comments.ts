import Comment from '@/database/models/Comment';
import User from '@/database/models/User';

export default class CommentModel {
	create = async (comment) => {
		return Comment.create(comment);
	}

	find = async (image_key: string) => {
		return Comment.findAll({
			where: {
				image_key
			},
			include: [{ model: User, attributes: ['username', 'name', 'last_name', 'email', 'id']}]
		});
	}

	update = async (image_key: string, user: string, text: string) => {
		return await Comment.update(
			{
				text
			}, { where: {
				image_key,
				owner_id: user
			},
			limit: 1,
			returning: true
		});
	}

	delete = async (image_key: string, user: string, id: string) => {
		return Comment.destroy({
			where: {
				owner_id: user,
				image_key,
				id
			},
			limit: 1
		});
	}
}