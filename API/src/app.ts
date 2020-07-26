import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { config } from 'dotenv';
import * as express from 'express';
import * as morgan from 'morgan';

import * as Sentry from '@sentry/node';
Sentry.init({ dsn: 'https://77db3c8c4a784bb5a16ac7cac6877bd2@o373069.ingest.sentry.io/5201580' });

const app = express();

config();

const corsOptions = {
	origin: '*',
	methods: [
		'GET',
		'PUT',
		'POST',
		'PATCH',
		'DELETE',
		'UPDATE'
	],
	credentials: true
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(morgan('dev'));

app.get('/', (req, res) => {
	return res.sendStatus(200);
});

import UserRouter from './routes/users';
import ImageRouter from './routes/images';

app.use(UserRouter);
app.use(ImageRouter);

app.use((err, req, res, next) => {
	if (err instanceof SyntaxError) {
		return res.status(400).send({
			errorCode: 'PARSE_ERROR',
			message: 'Arguments could not be parsed, make sure request is valid.'
		});
	}
	return res.status(500).send('Something broke!', err);
});

export default app;