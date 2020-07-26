import { IError, IResult } from '@/lib/interfaces';
import { controllerFunctionType } from '@/lib/types';
import { Request, Response, Router } from 'express';
const router = Router({ mergeParams: true });

import ImageController from '@/controllers/images';
import { checkQuery, checkParams, checkToken, checkBody } from '@/lib/middlewares';

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

router.post('/images', checkParams(), checkToken(), (req: Request, res: Response) => {
	ImageController.add(req, (e: IError, r: IResult) => {
		if (e) {
			return res.status(e.code).send(e.message);
		}
		return res.status(r.code).json(r.data);
	});
});

// Maybe use patch instead of put
router.put('/images/:id', checkBody(['title', 'description', 'tags']), checkToken(), defaultCallback(ImageController.update));

router.get('/images/:id', checkToken(), defaultCallback(ImageController.findById));

router.post('/images/:id/react', checkToken(), defaultCallback(ImageController.react));

router.post('/images/:id/unreact', checkToken(), defaultCallback(ImageController.removeReact));

router.post('/images/:id/comment', checkToken(), checkBody(['text']), defaultCallback(ImageController.comment));

router.put('/images/:id/comment/:comment_id', checkToken(), checkBody(['text']), defaultCallback(ImageController.updateComment));

router.delete('/images/:id/comment/:comment_id', checkToken(), defaultCallback(ImageController.removeComment));

router.get('/search/images', checkQuery(['q']), checkToken(), defaultCallback(ImageController.search));

router.get('/search/images/tag', checkQuery(['q']), checkToken(), defaultCallback(ImageController.searchByTag));

router.get('/search/images/desc', checkQuery(['q']), checkToken(), defaultCallback(ImageController.searchByDescription));

router.get('/search/images/latest', checkToken(), defaultCallback(ImageController.getLatest));

router.get('/popular/tags', checkToken(), defaultCallback(ImageController.getTags));

router.get('/suggest/tags', checkToken(), defaultCallback(ImageController.suggestTags));

router.delete('/images/:id', checkToken(), defaultCallback(ImageController.delete));

export default router;