import * as jwt from 'jsonwebtoken';
import { JWT_PRIVATE_KEY } from '@/lib/env';
import * as crypto from 'crypto';

export const p = (promise) => {
	return promise.then((data) => {
		return [null, data];
	})
		.catch((err) => [err]);
};

export const generateAccessToken = (id: string) => {
	return jwt.sign({ id }, JWT_PRIVATE_KEY);
};

export const createGoogleToken = async (params) => {
	const text = params.email + params.username;
	const algorithm = 'aes256';
	const cipher = await crypto.createCipher(algorithm, JWT_PRIVATE_KEY);
	return await cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
};