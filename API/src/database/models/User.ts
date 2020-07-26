import { Model, Column, Table, CreatedAt, UpdatedAt, PrimaryKey, IsUUID, HasMany } from 'sequelize-typescript';

import Image from './Image';
import Reaction from './Reaction';
@Table
export default class User extends Model<User> {

	@IsUUID(4)
	@PrimaryKey
	@Column
	id!: string;

	@Column
	username!: string;

	@Column
	name!: string;

	@Column
	last_name!: string;

	@Column
	email!: string;

	@Column
	google_token: string;

	@Column
	password!: string;

	@Column
	phone_number: string;

	@CreatedAt
	@Column
	created_at!: Date;

	@UpdatedAt
	@Column
	updated_at!: Date;

	@HasMany(() => Image)
	images: Image[];

	@HasMany(() => Reaction)
	reactions: Image[];
}