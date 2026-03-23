import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import {
  listSubjectsHandler, getSubjectHandler, getSubjectTreeHandler,
  getFirstVideoHandler, enrollHandler,
} from './subjects.controller';

const router = Router();

router.get('/', listSubjectsHandler);
router.get('/:id', getSubjectHandler);
router.get('/:id/tree', authenticate, getSubjectTreeHandler);
router.get('/:id/first-video', authenticate, getFirstVideoHandler);
router.post('/:id/enroll', authenticate, enrollHandler);

export default router;
