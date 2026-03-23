import prisma from '../../utils/prisma';

export async function getVideoProgress(userId: number, videoId: number) {
  return prisma.videoProgress.findUnique({ where: { userId_videoId: { userId, videoId } } });
}

export async function upsertVideoProgress(
  userId: number, videoId: number,
  lastPositionSeconds: number, isCompleted: boolean
) {
  return prisma.videoProgress.upsert({
    where: { userId_videoId: { userId, videoId } },
    create: {
      userId, videoId, lastPositionSeconds, isCompleted,
      completedAt: isCompleted ? new Date() : null,
    },
    update: {
      lastPositionSeconds,
      ...(isCompleted && { isCompleted: true, completedAt: new Date() }),
    },
  });
}

export async function getSubjectProgress(userId: number, subjectId: number) {
  const videos = await prisma.video.findMany({
    where: { section: { subjectId } },
    select: { id: true },
  });
  const videoIds = videos.map((v) => v.id);
  const progress = await prisma.videoProgress.findMany({ where: { userId, videoId: { in: videoIds } } });
  const total = videoIds.length;
  const completed = progress.filter((p) => p.isCompleted).length;
  return {
    total,
    completed,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    videos: progress,
  };
}
