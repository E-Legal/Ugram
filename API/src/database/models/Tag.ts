import { Model, Column, Table } from 'sequelize-typescript';

@Table
export default class Tag extends Model<Tag> {

	@Column
	name!: string;

	@Column
	count!: number;
}