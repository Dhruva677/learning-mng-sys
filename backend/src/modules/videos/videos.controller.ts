import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import * as videosService from './videos.service';

export async function getVideoHandler(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json(await videosService.getVideo(Number(req.params.videoId), req.user!.userId));
  } catch (err) { next(err); }
}
