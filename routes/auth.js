import { Router } from 'express';
const router = Router();

import { signup, login } from '../controllers/authController';

router.post('/signup', signup);
router.post('/login', login);

export default router;
