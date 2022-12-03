import { Router } from 'express';
import { checkAuth } from '../controllers/authController.js';
import * as draftController from '../controllers/draftController.js';

const router = Router();

router.use(checkAuth)

router.get('/', draftController.getPaginatedDrafts);
router.post('/', draftController.createDraft);

router.get('/:id', draftController.getDraftById);
router.patch('/:id', draftController.updateDraft);
router.delete('/:id', draftController.deleteDraft);

export default router;
