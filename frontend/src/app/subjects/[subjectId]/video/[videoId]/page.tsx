'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { videosApi, subjectsApi, progressApi } from '../../../../../lib/api';
import { Video, SubjectTree } from '../../../../../types';
import { useVideoStore } from '../../../../../store/videoStore';
import { useSidebarStore } from '../../../../../store/sidebarStore';
import { useAuthStore } from '../../../../../store/authStore';
import VideoPlayer from '../../../../../components/VideoPlayer';
import Sidebar from '../../../../../components/Sidebar';
import clsx from 'clsx';

export default function VideoPage() {
  const { subjectId, videoId } = useParams<{ subjectId: string; videoId: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const { setCurrentVideo, setProgress } = useVideoStore();
  const { setTree, isOpen } = useSidebarStore();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) { router.push('/login'); return; }

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [videoRes, treeRes, progressRes] = await Promise.all([
          videosApi.get(Number(videoId)),
          subjectsApi.getTree(Number(subjectId)),
          progressApi.getVideo(Number(videoId)),
        ]);
        setVideo(videoRes.data);
        setCurrentVideo(videoRes.data);
        setTree(treeRes.data as SubjectTree);
        setProgress(progressRes.data);
      } catch (err: unknown) {
        const status = (err as { response?: { status?: number } })?.response?.status;
        if (status === 403) setError('This video is locked. Complete the previous video first.');
        else if (status === 401) router.push('/login');
        else setError('Failed to load video');
      } finally {
        setLoading(false);
      }
    };

    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId, subjectId]);

  if (loading) return (
    <div className="flex items-center justify-center h-[calc(100vh-3.5rem)]">
      <div className="text-gray-400">Loading video...</div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-[calc(100vh-3.5rem)]">
      <div className="text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={() => router.back()} className="btn-secondary">Go back</button>
      </div>
    </div>
  );

  if (!video) return null;

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      <Sidebar subjectId={Number(subjectId)} currentVideoId={Number(videoId)} />
      <div className={clsx('flex-1 overflow-y-auto transition-all duration-300', isOpen ? 'ml-72' : 'ml-0')}>
        <div className="max-w-4xl mx-auto px-6 py-8">
          <VideoPlayer video={video} subjectId={Number(subjectId)} />
        </div>
      </div>
    </div>
  );
}
