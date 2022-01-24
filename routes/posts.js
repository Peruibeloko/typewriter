import { Router } from 'express';
import { checkAuth } from '../controllers/authController.js';
import * as postController from '../controllers/postController.js';

const router = Router();

router.get('/', postController.getPaginatedPosts);
router.post('/', [checkAuth, postController.createPost]);

router.get('/field', postController.getFieldsFromAllPosts);
router.get('/count', postController.countPosts);
router.get('/latest', postController.getLatestPost);

router.get('/offset/:offset', postController.getNextPostAfter);
router.get('/timestamp/:timestamp', postController.getPostByDate);

router.patch('/:timestamp', [checkAuth, postController.updatePost]);
router.delete('/:timestamp', [checkAuth, postController.deletePost]);

export default router;
