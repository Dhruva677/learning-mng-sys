import apiClient from './apiClient';
import { Subject, SubjectTree, Video, VideoProgress, SubjectProgress } from '../types';

export const authApi = {
  register: (data: { email: string; password: string; name: string }) =>
    apiClient.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    apiClient.post('/auth/login', data),
  logout: () => apiClient.post('/auth/logout'),
  refresh: () => apiClient.post('/auth/refresh'),
};

export const subjectsApi = {
  list: () => apiClient.get<Subject[]>('/subjects'),
  get: (id: number) => apiClient.get<Subject>(`/subjects/${id}`),
  getTree: (id: number) => apiClient.get<SubjectTree>(`/subjects/${id}/tree`),
  getFirstVideo: (id: number) => apiClient.get<Video>(`/subjects/${id}/first-video`),
  enroll: (id: number) => apiClient.post(`/subjects/${id}/enroll`),
};

export const videosApi = {
  get: (videoId: number) => apiClient.get<Video>(`/videos/${videoId}`),
};

export const progressApi = {
  getVideo: (videoId: number) => apiClient.get<VideoProgress>(`/progress/videos/${videoId}`),
  updateVideo: (videoId: number, data: { lastPositionSeconds: number; isCompleted: boolean }) =>
    apiClient.post<VideoProgress>(`/progress/videos/${videoId}`, data),
  getSubject: (subjectId: number) => apiClient.get<SubjectProgress>(`/progress/subjects/${subjectId}`),
};
