import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { getVideoHandler } from './videos.controller';

const router = Router();
router.get('/:videoId', authenticate, getVideoHandler);
export default router;
