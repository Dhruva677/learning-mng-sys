import { createError } from '../../middleware/error.middleware';
import { flattenVideos, isVideoUnlocked } from '../../utils/ordering';
import { getVideoById } from './videos.repository';
import prisma from '../../utils/prisma';

export async function getVideo(videoId: number, userId: number) {
  const video = await getVideoById(videoId);
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

  const progress = await prisma.videoProgress.findUnique({
    where: { userId_videoId: { userId, videoId } },
  });

  return {
    ...video,
    previousVideoId: entry.previousVideoId,
    nextVideoId: entry.nextVideoId,
    isUnlocked: true,
    isCompleted: completedIds.has(videoId),
    lastPositionSeconds: progress?.lastPositionSeconds ?? 0,
  };
}
