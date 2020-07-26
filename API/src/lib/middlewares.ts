import * as jwt from 'jsonwebtoken';
import { JWT_PRIVATE_KEY } from '@/lib/env';

export const checkToken = () => {
	return (req, res, next) => {
		const token = req.header('authorization');
		if (!token)
			return res.status(403).json({ sucess: false, message: 'No token provided'});
		try {
			const decoded = jwt.verify(token, JWT_PRIVATE_KEY);
			req.body.user = decoded.id;
		} catch (e) {
			return res.status(401).json({ sucess: false, message: 'Unauthorized'});
		}
		return next();
	};
};

export const checkBody = (array: string[]) => {
	return (req, res, next) => {
		const q = req.body;
		if (!array.every((x) => x in q)) {
			const str = array.join(',');
			return res.status(400).json({ success: false, message: `Required parameters ${str}` });
		}
		return next();
	};
};

const isId = (id: string) => {
	return id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
};

export const checkParams = () => {
	return (req, res, next) => {
		const id = req.params.id;
		if (id && !isId(id))
			return res.status(400).json({ success: false, message: `${id} is not a valid ID` });
		return next();
	};
};

export const checkQuery = (array: string[]) => {
	return (req, res, next) => {
		const q = req.query;
		if (!array.every((x) => x in q)) {
			const str = array.join(',');
			return res.status(400).json({ success: false, message: `Required parameters ${str}` });
		}
		return next();
	};
};