import { Router } from 'express';
import { login, signup, checkAuth } from '../controllers/authController.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/check', [checkAuth, (req, res) => res.sendStatus(200)]);

export default router;
