import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import * as subjectsService from './subjects.service';

export async function listSubjectsHandler(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json(await subjectsService.listSubjects(req.user?.userId));
  } catch (err) { next(err); }
}

export async function getSubjectHandler(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json(await subjectsService.getSubject(Number(req.params.id)));
  } catch (err) { next(err); }
}

export async function getSubjectTreeHandler(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json(await subjectsService.getSubjectTree(Number(req.params.id), req.user!.userId));
  } catch (err) { next(err); }
}

export async function getFirstVideoHandler(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json(await subjectsService.getFirstVideo(Number(req.params.id)));
  } catch (err) { next(err); }
}

export async function enrollHandler(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    res.status(201).json(await subjectsService.enroll(req.user!.userId, Number(req.params.id)));
  } catch (err) { next(err); }
}
