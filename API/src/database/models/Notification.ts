import { Model, Column, Table, ForeignKey, BelongsTo, AllowNull } from 'sequelize-typescript';

import User from './User';

@Table
export default class Notification extends Model<Notification> {

	@ForeignKey(() => User)
	@AllowNull
	@Column
	owner_id!: string;

	// Person who likes the image
	@Column
	username!: string;

	// Person whose image was liked
	@BelongsTo(() => User)
	owner!: User;

	@Column
	image!: string;

	@Column
	action!: string;
}