import { Model, Column, Table, CreatedAt, UpdatedAt, ForeignKey, BelongsTo, DataType, HasMany, PrimaryKey } from 'sequelize-typescript';
import * as uuid from 'uuid/v4';

import User from './User';
import Reaction from './Reaction';
import Comment from './Comment';

@Table
export default class Image extends Model<Image> {

	@Column
	url!: string;

	@PrimaryKey
	@Column
	key!: string;

	@ForeignKey(() => User)
	@Column
	owner_id: string;

	@Column
	title: string;

	@Column(DataType.ARRAY(DataType.STRING))
	tags: string[];

	@Column
	description: string;

	@BelongsTo(() => User)
	owner: User;

	@HasMany(() => Reaction, {
		onDelete: 'CASCADE'
	})
	reactions: Reaction[];

	@HasMany(() => Comment, {
		onDelete: 'CASCADE'
	})
	comments: Comment[];

	@CreatedAt
	@Column
	createdAt!: Date;

	@UpdatedAt
	@Column
	updatedAt!: Date;
}