import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import * as progressService from './progress.service';

export async function getVideoProgressHandler(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json(await progressService.getVideoProgress(req.user!.userId, Number(req.params.videoId)));
  } catch (err) { next(err); }
}

export async function updateVideoProgressHandler(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { lastPositionSeconds, isCompleted } = req.body;
    res.json(await progressService.updateVideoProgress(
      req.user!.userId, Number(req.params.videoId),
      lastPositionSeconds ?? 0, isCompleted ?? false
    ));
  } catch (err) { next(err); }
}

export async function getSubjectProgressHandler(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json(await progressService.getSubjectProgress(req.user!.userId, Number(req.params.subjectId)));
  } catch (err) { next(err); }
}
