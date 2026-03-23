import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { getVideoProgressHandler, updateVideoProgressHandler, getSubjectProgressHandler } from './progress.controller';

const router = Router();
router.get('/videos/:videoId', authenticate, getVideoProgressHandler);
router.post('/videos/:videoId', authenticate, updateVideoProgressHandler);
router.get('/subjects/:subjectId', authenticate, getSubjectProgressHandler);
export default router;
