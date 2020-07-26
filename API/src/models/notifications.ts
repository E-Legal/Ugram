import Notification from '@/database/models/Notification';

export default class NotificationModel {
	create = async (notification) => {
		return Notification.create(notification);
	}

	find = async (user: string) => {
		return Notification.findAll({
			where: {
				owner_id: user,
			}
		});
	}

	delete = async (user: string) => {
		return Notification.destroy({
			where: {
				owner_id: user
			}
		});
	}
}