import app from './app';
import { sequelize } from '@/database';

const PORT = process.env.PORT || 3030;

const main = (async () => {

	// Force true = sequelize drops everything and restarts => good for tests
	await sequelize.sync({ force: true }).then(() => {
		console.log('Connected to the database');
	}).catch((e) => {
		console.log('Connection failed', e);
	});

	app.listen(PORT, () => {
		console.log(`Listening on PORT ${PORT}`);
	});
});

main();