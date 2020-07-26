import Reaction from '@/database/models/Reaction';

export default class ReactionModel {
	create = async (reaction) => {
		return Reaction.create(reaction);
	}

	find = async (image_key: string, user: string) => {
		return Reaction.findOne({
			where: {
				owner_id: user,
				image_key
			}
		});
	}

	delete = async (image_key: string, user: string) => {
		return Reaction.destroy({
			where: {
				owner_id: user,
				image_key
			},
			limit: 1
		});
	}
}