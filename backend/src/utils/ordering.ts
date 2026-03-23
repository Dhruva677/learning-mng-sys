import { Section, Video } from '@prisma/client';

export interface VideoWithSection extends Video {
  section: Section;
}

export interface FlatVideo {
  video: VideoWithSection;
  previousVideoId: number | null;
  nextVideoId: number | null;
  globalIndex: number;
}

export function flattenVideos(
  sections: (Section & { videos: Video[] })[]
): FlatVideo[] {
  const sorted = [...sections].sort((a, b) => a.orderIndex - b.orderIndex);

  const flat: VideoWithSection[] = [];
  for (const section of sorted) {
    const sortedVideos = [...section.videos].sort((a, b) => a.orderIndex - b.orderIndex);
    for (const video of sortedVideos) {
      flat.push({ ...video, section });
    }
  }

  return flat.map((video, idx) => ({
    video,
    previousVideoId: idx > 0 ? flat[idx - 1].id : null,
    nextVideoId: idx < flat.length - 1 ? flat[idx + 1].id : null,
    globalIndex: idx,
  }));
}

export function isVideoUnlocked(
  globalIndex: number,
  previousVideoId: number | null,
  completedVideoIds: Set<number>
): boolean {
  if (globalIndex === 0) return true;
  if (previousVideoId === null) return true;
  return completedVideoIds.has(previousVideoId);
}
