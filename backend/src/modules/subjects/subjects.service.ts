import { createError } from '../../middleware/error.middleware';
import { flattenVideos, isVideoUnlocked } from '../../utils/ordering';
import * as repo from './subjects.repository';
import prisma from '../../utils/prisma';

export async function listSubjects(userId?: number) {
  const subjects = await repo.getAllPublishedSubjects();
  if (!userId) return subjects;

  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    select: { subjectId: true },
  });
  const enrolledIds = new Set(enrollments.map((e) => e.subjectId));
  return subjects.map((s) => ({ ...s, isEnrolled: enrolledIds.has(s.id) }));
}

export async function getSubject(id: number) {
  const subject = await repo.getSubjectById(id);
  if (!subject) throw createError('Subject not found', 404);
  return subject;
}

export async function getSubjectTree(subjectId: number, userId: number) {
  const subject = await repo.getSubjectWithTree(subjectId);
  if (!subject) throw createError('Subject not found', 404);

  const flat = flattenVideos(subject.sections);

  const completedProgress = await prisma.videoProgress.findMany({
    where: { userId, isCompleted: true },
    select: { videoId: true },
  });
  const completedIds = new Set(completedProgress.map((p) => p.videoId));

  const sectionsWithLock = subject.sections.map((section) => ({
    ...section,
    videos: section.videos.map((video) => {
      const entry = flat.find((f) => f.video.id === video.id)!;
      return {
        ...video,
        isUnlocked: isVideoUnlocked(entry.globalIndex, entry.previousVideoId, completedIds),
        isCompleted: completedIds.has(video.id),
        previousVideoId: entry.previousVideoId,
        nextVideoId: entry.nextVideoId,
      };
    }),
  }));

  return { ...subject, sections: sectionsWithLock };
}

export async function getFirstVideo(subjectId: number) {
  const subject = await repo.getSubjectById(subjectId);
  if (!subject) throw createError('Subject not found', 404);
  const video = await repo.getFirstVideoOfSubject(subjectId);
  if (!video) throw createError('No videos found', 404);
  return video;
}

export async function enroll(userId: number, subjectId: number) {
  const subject = await repo.getSubjectById(subjectId);
  if (!subject) throw createError('Subject not found', 404);
  return repo.enrollUser(userId, subjectId);
}
