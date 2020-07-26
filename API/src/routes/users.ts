import { IError, IResult } from '@/lib/interfaces';
import { controllerFunctionType } from '@/lib/types';
import { Request, Response, Router } from 'express';
const router = Router({ mergeParams: true });

import UserController from '@/controllers/users';
import { checkBody, checkQuery, checkParams, checkToken } from '@/lib/middlewares';

const defaultCallback = (f: controllerFunctionType) => {
	return (req: Request, res: Response) => {
		f({ ...req.body, ...req.params, ...req.query }, (e: IError, r: IResult) => {
			if (e) {
				return res.status(e.code).send(e.message);
			}
			return res.status(r.code).json(r.data);
		});
	};
};

router.post('/register',
	checkBody(['username', 'name', 'last_name', 'email', 'phone_number', 'password']),
	defaultCallback(UserController.register)
);

router.post('/login', checkBody(['email', 'password']),
	defaultCallback(UserController.login)
);

router.post('/google/login',
	checkBody(['name', 'last_name', 'email', 'token', 'username']),
	defaultCallback(UserController.loginGoogle)
);

// Should check token
router.put('/users',
	checkBody(['email', 'last_name', 'name', 'phone_number', 'username']),
	checkToken(),
	defaultCallback(UserController.updateProfile)
);

router.get('/users/:id/images', checkParams(), checkToken(), defaultCallback(UserController.getImages));

router.get('/users/:id', checkParams(), checkToken(), defaultCallback(UserController.getProfile));

router.delete('/users', checkToken(), defaultCallback(UserController.deleteUser));

router.get('/users', checkToken(), defaultCallback(UserController.getUsers));

router.get('/search/users', checkQuery(['q']), checkToken(), defaultCallback(UserController.search));

router.get('/notifications', checkToken(), defaultCallback(UserController.getNotifications));

export default router;