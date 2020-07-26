import { Sequelize } from 'sequelize-typescript';
import { config } from 'dotenv';

config();

const HOSTNAME = process.env.RDS_HOSTNAME;
const PORT = process.env.RDS_PORT;
const DB_NAME = process.env.RDS_DB_NAME;
const USERNAME = process.env.RDS_USERNAME;
const PASSWORD = process.env.RDS_PASSWORD;

const URL = HOSTNAME ? `postgres://${USERNAME}:${PASSWORD}@${HOSTNAME}:${PORT}/${DB_NAME}`
	: process.env.DATABASE_URL;

export const sequelize = new Sequelize(URL, {
	dialect: 'postgres',
	database: 'users',
	models: [__dirname + '/models'],
	logging: false
});