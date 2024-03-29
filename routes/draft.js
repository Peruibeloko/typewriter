import { Router } from 'express';
import { checkAuth } from '../controllers/authController.js';
import * as draftController from '../controllers/draftController.js';

const router = Router();

router.get('/', [checkAuth, draftController.getPaginatedDrafts]);
router.post('/', [checkAuth, draftController.createDraft]);

router.get('/:id', [checkAuth, draftController.getDraftById]);
router.patch('/:id', [checkAuth, draftController.updateDraft]);
router.delete('/:id', [checkAuth, draftController.deleteDraft]);

export default router;
