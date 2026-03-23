export interface User {
  id: number;
  email: string;
  name: string;
}

export interface Subject {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  thumbnail: string | null;
  isPublished: boolean;
  isEnrolled?: boolean;
  _count?: { sections: number; enrollments: number };
}

export interface Video {
  id: number;
  sectionId: number;
  title: string;
  description: string | null;
  youtubeUrl: string;
  orderIndex: number;
  durationSeconds: number;
  isUnlocked?: boolean;
  isCompleted?: boolean;
  previousVideoId: number | null;
  nextVideoId: number | null;
  lastPositionSeconds?: number;
}

export interface Section {
  id: number;
  subjectId: number;
  title: string;
  orderIndex: number;
  videos: Video[];
}

export interface SubjectTree extends Subject {
  sections: Section[];
}

export interface VideoProgress {
  userId: number;
  videoId: number;
  lastPositionSeconds: number;
  isCompleted: boolean;
  completedAt: string | null;
}

export interface SubjectProgress {
  total: number;
  completed: number;
  percentage: number;
  videos: VideoProgress[];
}
