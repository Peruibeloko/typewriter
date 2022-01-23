import { Router } from 'express';
import { checkAuth } from '../controllers/authController.js';
import * as postController from '../controllers/postController.js';

const router = Router();

router.get('/', postController.getAllPosts);
router.post('/', [checkAuth, postController.createPost]);

router.get('/field/:field', postController.getFieldFromAllPosts);

router.get('/count', postController.countPosts);

router.get('/:id', postController.getPost);
router.patch('/:id', [checkAuth, postController.updatePost]);
router.delete('/:id', [checkAuth, postController.deletePost]);

export default router;
