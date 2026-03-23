import { create } from 'zustand';
import { Video, VideoProgress } from '../types';

interface VideoState {
  currentVideo: Video | null;
  progress: VideoProgress | null;
  setCurrentVideo: (video: Video) => void;
  setProgress: (progress: VideoProgress) => void;
  updatePosition: (seconds: number) => void;
  markCompleted: () => void;
}

export const useVideoStore = create<VideoState>((set) => ({
  currentVideo: null,
  progress: null,
  setCurrentVideo: (video) => set({ currentVideo: video }),
  setProgress: (progress) => set({ progress }),
  updatePosition: (seconds) =>
    set((s) => ({ progress: s.progress ? { ...s.progress, lastPositionSeconds: seconds } : null })),
  markCompleted: () =>
    set((s) => ({
      progress: s.progress
        ? { ...s.progress, isCompleted: true, completedAt: new Date().toISOString() }
        : null,
    })),
}));
