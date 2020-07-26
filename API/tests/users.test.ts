import * as http from 'http';
import * as request from 'supertest';
import app from '../src/app';
import { sequelize } from '../src/database';

const PORT = process.env.PORT || 3030;

const name = 'Jest';
const last_name = 'last_name';
const username = 'username';
const email = 'jest-test@exemple.com';
const phone_number = '123456789';

let server: any;
let image_key: string;
let image_key_next: string;
let token: string;
let user_id: string;
let comment_id: string;

beforeAll(async (done) => {
	await sequelize.sync({ force: true }).then(() => {
		console.log('Connected to the database');
	}).catch((e) => {
		throw (e);
	});
	server = await http.createServer(app);
	await server.listen(PORT);
	await done();
});

afterAll(async (done) => {
	await server.close();
	await sequelize.close();
	done();
});

it('Should return 200', (done) => {
	request(app).get('/')
		.end((err, res) => {
			expect(res.status).toEqual(200);
			done();
		});
});

describe('Register', () => {
	it('Should create a new user', (done) => {
		request(app)
			.post('/register')
			.send({
				email,
				last_name,
				name,
				password: '1234',
				phone_number,
				username
			})
			.end((err, res) => {
				expect(res.status).toEqual(201);
				done();
			});
	});

	it('Should return missing parameters', (done) => {
		request(app)
			.post('/register')
			.end((err, res) => {
				expect(res.status).toEqual(400);
				done();
			});
	});
});

describe('Register', () => {
	it('Should create a new user', (done) => {
		request(app)
			.post('/register')
			.send({
				email: 'toto@gmail.com',
				last_name,
				name: 'Totojest',
				password: '1234',
				phone_number,
				username
			})
			.end((err, res) => {
				expect(res.status).toEqual(201);
				done();
			});
	});

	it('Should return missing parameters', (done) => {
		request(app)
			.post('/register')
			.end((err, res) => {
				expect(res.status).toEqual(400);
				done();
			});
	});
});

describe('Login', () => {
	it('Should login the user', (done) => {
		request(app)
			.post('/login')
			.send({
				email: 'jest-test@exemple.com',
				password: '1234'
			})
			.end((err, res) => {
				expect(res.status).toEqual(200);
				user_id = res.body.id;
				token = res.body.token;
				done();
			});
	});
});

describe('Get Profile', () => {
	it("Should return a user's profile", (done) => {
		request(app)
			.get(`/users/${user_id}`)
			.set({
				Authorization: token
			})
			.end((err, res) => {
				expect(res.status).toEqual(200);
				expect(res.body.name).toEqual(name);
				expect(res.body.username).toEqual(username);
				expect(res.body.last_name).toEqual(last_name);
				expect(res.body.email).toEqual(email);
				done();
			});
	});
});

describe('Put profile', () => {
	it("Should update the user's profile", (done) => {
		request(app)
			.put('/users/')
			.set({
				Authorization: token
			})
			.send({
				email: 'newjest-test@exemple.com',
				last_name: 'NewJest',
				name: 'NewJest',
				phone_number: '0987654321',
				username: 'NewJest'
			})
			.end((err, res) => {
				expect(res.status).toEqual(200);
				done();
			});
	});

	it("Should update the user's profile", (done) => {
		request(app)
			.put('/users/')
			.set({
				Authorization: token
			})
			.send({
				email: 'newjest-test@exemple.com',
				last_name: 'NewJest',
				name: 'NewJest',
				phone_number: '0987654321',
				username: 'NewJest'
			})
			.end((err, res) => {
				expect(res.status).toEqual(200);
				done();
			});
	});
});

describe('Get Users ID', () => {
	it('Should get an array of IDs', (done) => {
		request(app)
			.get('/users')
			.set({
				Authorization: token
			})
			.query({
				q: ''
			})
			.end((err, res) => {
				expect(res.status).toEqual(200);
				done();
			});
	});
});

describe('Find users', () => {
	it('Should get an array of users whose name starts with toto', (done) => {
		request(app)
			.get('/search/users')
			.set({
				Authorization: token
			})
			.query({
				q: 'toto'
			})
			.end((err, res) => {
				expect(res.status).toEqual(200);
				expect(res.body.length).toEqual(1);
				done();
			});
	});
});

describe('Find users', () => {
	it('Should get an array of users whose name starts with helloworld', (done) => {
		request(app)
			.get('/search/users')
			.set({
				Authorization: token
			})
			.query({
				q: 'hellworld'
			})
			.end((err, res) => {
				expect(res.status).toEqual(200);
				expect(res.body.length).toEqual(0);
				done();
			});
	});
});

describe('Upload Image', () => {
	const title = 'This is a title';
	const description = 'This is the first description';
	const tags = ['some', 'random', 'tags'];
	const filePath = `${__dirname}/profile.jpg`;
	it('Should upload an image to the server', (done) => {
		request(app)
			.post('/images')
			.set({
				Authorization: token
			})
			.query({
				title,
				description,
				tags
			})
			.attach('file', filePath)
			.end((err, res) => {
				expect(res.status).toEqual(200);
				expect(res.body.title).toEqual(title);
				expect(res.body.description).toEqual(description);
				expect(res.body.tags).toEqual(tags);
				image_key = res.body.key;
				done();
			});
	});
});

describe('Get user images', () => {
	it('Get user images', (done) => {
		request(app)
			.get(`/users/${user_id}/images`)
			.set({
				Authorization: token
			})
			.end((err, res) => {
				expect(res.status).toEqual(200);
				expect(res.body.length).toEqual(1);
				done();
			});
	});
});

describe('Get Profile', () => {
	it("Should return a user's profile", (done) => {
		request(app)
			.get(`/users/${user_id}`)
			.set({
				Authorization: token
			})
			.end((err, res) => {
				expect(res.status).toEqual(200);
				expect(res.body.images.length).toEqual(1);
				done();
			});
	});
});

describe('Upload Image', () => {
	const title = 'This is a title';
	const description = 'This is a description';
	const tags = ['these', 'are', 'some', 'random', 'tags'];
	const filePath = `${__dirname}/profile.jpg`;
	it('Should upload an image to the server', (done) => {
		request(app)
			.post('/images')
			.set({
				Authorization: token
			})
			.query({
				title,
				description,
				tags
			})
			.attach('file', filePath)
			.end((err, res) => {
				expect(res.status).toEqual(200);
				expect(res.body.title).toEqual(title);
				expect(res.body.description).toEqual(description);
				expect(res.body.tags).toEqual(tags);
				image_key_next = res.body.key;
				done();
			});
	});
});

describe('Get user images', () => {
	it('Get user images', (done) => {
		request(app)
			.get(`/users/${user_id}/images`)
			.set({
				Authorization: token
			})
			.end((err, res) => {
				expect(res.status).toEqual(200);
				expect(res.body.length).toEqual(2);
				done();
			});
	});
});

describe('Get image by ID', () => {
	it('Gets an image', (done) => {
		request(app)
			.get(`/images/${image_key}`)
			.set({
				Authorization: token
			})
			.end((err, res) => {
				expect(res.status).toEqual(200);
				done();
			});
	});
});

describe('Search images', () => {
	it('Searches the images that contain the tag are', (done) => {
		request(app)
			.get('/search/images/tag')
			.set({
				Authorization: token
			})
			.query({
				q: 'are'
			})
			.end((err, res) => {
				expect(res.status).toEqual(200);
				expect(res.body.length).toEqual(1);
				done();
			});
	});

	it('Searches the images that contain the description first', (done) => {
		request(app)
			.get('/search/images/desc')
			.set({
				Authorization: token
			})
			.query({
				q: 'first'
			})
			.end((err, res) => {
				expect(res.status).toEqual(200);
				expect(res.body.length).toEqual(1);
				done();
			});
	});

	it('Searches the images that contain the tag or description [tags]', (done) => {
		request(app)
			.get('/search/images')
			.set({
				Authorization: token
			})
			.query({
				q: 'tags'
			})
			.end((err, res) => {
				expect(res.status).toEqual(200);
				expect(res.body.length).toEqual(2);
				done();
			});
	});

	it('Searches the latest images posted', (done) => {
		request(app)
			.get('/search/images/latest')
			.set({
				Authorization: token
			})
			.end((err, res) => {
				expect(res.status).toEqual(200);
				done();
			});
	});
});

describe('Reactions', () => {
	it('Creates a new reaction to an image', (done) => {
		request(app)
			.post(`/images/${image_key}/react`)
			.set({
				Authorization: token
			})
			.end((err, res) => {
				expect(res.status).toEqual(200);
				done();
			});
	});

	describe('Get image by ID', () => {
		it('Gets an image', (done) => {
			request(app)
				.get(`/images/${image_key}`)
				.set({
					Authorization: token
				})
				.end((err, res) => {
					expect(res.status).toEqual(200);
					expect(res.body.reactions.length).toEqual(1);
					done();
				});
		});
	});

	it ('Checking the notifications after the notification', (done) => {
		request(app)
			.get('/notifications')
			.set({
				Authorization: token
			})
			.end((err, res) => {
				expect(res.status).toEqual(200);
				done();
			});
	});

	it('React twice to the same image', (done) => {
		request(app)
			.post(`/images/${image_key}/react`)
			.set({
				Authorization: token
			})
			.end((err, res) => {
				expect(res.status).toEqual(400);
				done();
			});
	});

	it('Remove a reaction from an image', (done) => {
		request(app)
			.post(`/images/${image_key}/unreact`)
			.set({
				Authorization: token
			})
			.end((err, res) => {
				expect(res.status).toEqual(200);
				done();
			});
	});

	it('React after deleting the reaction', (done) => {
		request(app)
			.post(`/images/${image_key}/react`)
			.set({
				Authorization: token
			})
			.end((err, res) => {
				expect(res.status).toEqual(200);
				done();
			});
	});
});

describe('Comments', () => {
	it('Comments an image', (done) => {
		request(app)
			.post(`/images/${image_key}/comment`)
			.set({
				Authorization: token
			})
			.send({
				text: 'This is a comment'
			})
			.end((err, res) => {
				expect(res.status).toEqual(200);
				comment_id = res.body.id;
				done();
			});
	});

	describe('Get image by ID', () => {
		it('Gets an image', (done) => {
			request(app)
				.get(`/images/${image_key}`)
				.set({
					Authorization: token
				})
				.end((err, res) => {
					expect(res.status).toEqual(200);
					expect(res.body.comments.length).toEqual(1);
					done();
				});
		});
	});

	it('Update a comment', (done) => {
		const text = 'This is an updated comment';
		request(app)
			.put(`/images/${image_key}/comment/${comment_id}`)
			.set({
				Authorization: token
			})
			.send({
				text
			})
			.end((err, res) => {
				expect(res.status).toEqual(200);
				expect(res.body.text).toEqual(text);
				done();
			});
	});

	describe('Get image by ID', () => {
		it('Gets an image', (done) => {
			request(app)
				.get(`/images/${image_key}`)
				.set({
					Authorization: token
				})
				.end((err, res) => {
					expect(res.status).toEqual(200);
					expect(res.body.comments.length).toEqual(1);
					done();
				});
		});
	});

	it ('Checking the notifications after the notification', (done) => {
		request(app)
			.get('/notifications')
			.set({
				Authorization: token
			})
			.end((err, res) => {
				expect(res.status).toEqual(200);
				done();
			});
	});

	it('Deletes a comment from an image', (done) => {
		request(app)
			.delete(`/images/${image_key}/comment/${comment_id}`)
			.set({
				Authorization: token
			})
			.end((err, res) => {
				expect(res.status).toEqual(200);
				done();
			});
	});
});

describe('Get image by ID', () => {
	it('Gets an image', (done) => {
		request(app)
			.get(`/images/${image_key}`)
			.set({
				Authorization: token
			})
			.end((err, res) => {
				expect(res.status).toEqual(200);
				done();
			});
	});
});

describe('Delete image', () => {
	it('Deletes an image', (done) => {
		request(app)
			.delete(`/images/${image_key}`)
			.set({
				Authorization: token
			})
			.end((err, res) => {
				expect(res.status).toEqual(203);
				done();
			});
	});
});

describe('Get user images', () => {
	it('Get user images', (done) => {
		request(app)
			.get(`/users/${user_id}/images`)
			.set({
				Authorization: token
			})
			.end((err, res) => {
				expect(res.status).toEqual(200);
				expect(res.body.length).toEqual(1);
				done();
			});
	});
});

describe('Update Image', () => {
	const title = 'This is a new title';
	const description = 'This is a new description';
	const tags = ['these', 'are', 'some', 'new', 'tags'];
	it('Should update the image tags and description', (done) => {
		request(app)
			.put(`/images/${image_key_next}`)
			.set({
				Authorization: token
			})
			.send({
				title,
				description,
				tags
			})
			.end((err, res) => {
				expect(res.status).toEqual(200);
				expect(res.body.title).toEqual(title);
				expect(res.body.description).toEqual(description);
				expect(res.body.tags).toEqual(tags);
				done();
			});
	});
});

describe('Delete image', () => {
	it('Deletes an image', (done) => {
		request(app)
			.delete(`/images/${image_key_next}`)
			.set({
				Authorization: token
			})
			.end((err, res) => {
				expect(res.status).toEqual(203);
				done();
			});
	});
});

describe('Get user images', () => {
	it('Get user images', (done) => {
		request(app)
			.get(`/users/${user_id}/images`)
			.set({
				Authorization: token
			})
			.end((err, res) => {
				expect(res.status).toEqual(200);
				expect(res.body.length).toEqual(0);
				done();
			});
	});
});

describe('Delete User', () => {
	it('Should delete the user', (done) => {
		request(app)
			.delete('/users')
			.set({
				Authorization: token
			})
			.end((err, res) => {
				expect(res.status).toEqual(204);
				done();
			});
	});
});

describe('Get Profile', () => {
	it('Should return 400 because the user is deleted', (done) => {
		request(app)
			.get(`/users/${user_id}`)
			.set({
				Authorization: token
			})
			.end((err, res) => {
				expect(res.status).toEqual(400);
				done();
			});
	});
});

describe('Tags', () => {
	it ('Should return the most popular tags', (done) => {
		request(app)
			.get('/popular/tags')
			.set({
				Authorization: token
			})
			.end((err, res) => {
				expect(res.status).toEqual(200);
				done();
			});
	});

	it('Should suggest some tags', (done) => {
		request(app)
			.get('/suggest/tags')
			.set({
				Authorization: token
			})
			.end((err, res) => {
				expect(res.status).toEqual(200);
				expect(res.body.length).toEqual(5);
				done();
			});
	});

	it('Should suggest some tags', (done) => {
		request(app)
			.get('/suggest/tags')
			.set({
				Authorization: token
			})
			.send({
				q: 't'
			})
			.end((err, res) => {
				expect(res.status).toEqual(200);
				expect(res.body.length).toEqual(2);
				done();
			});
	});
});
