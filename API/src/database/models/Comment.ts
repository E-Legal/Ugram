import { Model, Column, Table, ForeignKey, BelongsTo, AllowNull, IsUUID, PrimaryKey } from 'sequelize-typescript';

import User from './User';
import Image from './Image';

@Table
export default class Comment extends Model<Comment> {

	@IsUUID(4)
	@PrimaryKey
	@Column
	id!: string;

	@ForeignKey(() => Image)
	@AllowNull
	@Column
	image_key: string;

	@ForeignKey(() => User)
	@Column
	owner_id!: string;

	@BelongsTo(() => Image)
	image!: Image;

	@BelongsTo(() => User)
	user: string;

	@Column
	text!: string;
}