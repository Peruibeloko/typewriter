import { Router } from 'express';
import { checkAuth } from '../controllers/authController.js';
import * as postController from '../controllers/postController.js';

const router = Router();

router.get('/', postController.getPaginatedPosts);
router.post('/', [checkAuth, postController.createPost]);

router.get('/count', postController.countPosts);
router.get('/latest', postController.getLatestPostId);
router.get('/first', postController.getFirstPostId);
router.get('/random', postController.getRandomPostId);

router.get('/:id', postController.getPostById);
router.patch('/:id', [checkAuth, postController.updatePost]);
router.delete('/:id', [checkAuth, postController.deletePost]);

router.get('/:id/next', postController.getNextPostId);
router.get('/:id/prev', postController.getPreviousPostId);

export default router;
