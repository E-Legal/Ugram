import { Model, Column, Table, ForeignKey, BelongsTo, AllowNull } from 'sequelize-typescript';

import User from './User';
import Image from './Image';

@Table
export default class Reaction extends Model<Reaction> {

	@ForeignKey(() => Image)
	@AllowNull
	@Column
	image_key: string;

	@ForeignKey(() => User)
	@Column
	owner_id!: string;

	@BelongsTo(() => Image)
	image!: Image;

	@Column
	type!: string;
}