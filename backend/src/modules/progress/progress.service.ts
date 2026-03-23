import { createError } from '../../middleware/error.middleware';
import * as repo from './progress.repository';
import prisma from '../../utils/prisma';
import { flattenVideos, isVideoUnlocked } from '../../utils/ordering';

export async function getVideoProgress(userId: number, videoId: number) {
  const progress = await repo.getVideoProgress(userId, videoId);
  return progress ?? { userId, videoId, lastPositionSeconds: 0, isCompleted: false, completedAt: null };
}

export async function updateVideoProgress(
  userId: number, videoId: number,
  lastPositionSeconds: number, isCompleted: boolean
) {
  const video = await prisma.video.findUnique({ where: { id: videoId }, include: { section: true } });
  if (!video) throw createError('Video not found', 404);

  const subject = await prisma.subject.findUnique({
    where: { id: video.section.subjectId },
    include: { sections: { include: { videos: true } } },
  });
  if (!subject) throw createError('Subject not found', 404);

  const flat = flattenVideos(subject.sections);
  const entry = flat.find((f) => f.video.id === videoId);
  if (!entry) throw createError('Video not in subject tree', 404);

  const completedProgress = await prisma.videoProgress.findMany({
    where: { userId, isCompleted: true },
    select: { videoId: true },
  });
  const completedIds = new Set(completedProgress.map((p) => p.videoId));

  if (!isVideoUnlocked(entry.globalIndex, entry.previousVideoId, completedIds)) {
    throw createError('Video is locked', 403);
  }

  return repo.upsertVideoProgress(userId, videoId, lastPositionSeconds, isCompleted);
}

export async function getSubjectProgress(userId: number, subjectId: number) {
  const subject = await prisma.subject.findUnique({ where: { id: subjectId } });
  if (!subject) throw createError('Subject not found', 404);
  return repo.getSubjectProgress(userId, subjectId);
}
