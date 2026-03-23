'use client';
import { useEffect, useRef, useCallback } from 'react';
import YouTube, { YouTubeEvent, YouTubePlayer } from 'react-youtube';
import { useRouter } from 'next/navigation';
import { progressApi } from '../lib/api';
import { useVideoStore } from '../store/videoStore';
import { Video } from '../types';

interface VideoPlayerProps {
  video: Video;
  subjectId: number;
}

export default function VideoPlayer({ video, subjectId }: VideoPlayerProps) {
  const router = useRouter();
  const playerRef = useRef<YouTubePlayer | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { progress, updatePosition, markCompleted } = useVideoStore();

  const extractYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/);
    return match?.[1] ?? url;
  };

  const saveProgress = useCallback(async (isCompleted = false) => {
    if (!playerRef.current) return;
    try {
      const seconds = Math.floor(await playerRef.current.getCurrentTime());
      updatePosition(seconds);
      await progressApi.updateVideo(video.id, { lastPositionSeconds: seconds, isCompleted });
      if (isCompleted) markCompleted();
    } catch { /* silent */ }
  }, [video.id, updatePosition, markCompleted]);

  const stopTracking = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  }, []);

  useEffect(() => () => stopTracking(), [stopTracking]);

  const onReady = (e: YouTubeEvent) => {
    playerRef.current = e.target;
    const start = progress?.lastPositionSeconds ?? video.lastPositionSeconds ?? 0;
    if (start > 0) e.target.seekTo(start, true);
  };

  const onPlay = () => {
    stopTracking();
    intervalRef.current = setInterval(() => saveProgress(false), 5000);
  };

  const onPause = () => { stopTracking(); saveProgress(false); };

  const onEnd = async () => {
    stopTracking();
    await saveProgress(true);
    if (video.nextVideoId) {
      setTimeout(() => router.push(`/subjects/${subjectId}/video/${video.nextVideoId}`), 2000);
    }
  };

  return (
    <div className="w-full">
      <div className="relative w-full rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}>
        <YouTube
          videoId={extractYouTubeId(video.youtubeUrl)}
          className="absolute inset-0 w-full h-full"
          iframeClassName="w-full h-full"
          onReady={onReady}
          onPlay={onPlay}
          onPause={onPause}
          onEnd={onEnd}
          opts={{ width: '100%', height: '100%', playerVars: { rel: 0, modestbranding: 1 } }}
        />
      </div>

      <div className="mt-4">
        <h1 className="text-2xl font-bold text-gray-900">{video.title}</h1>
        {video.description && <p className="mt-2 text-gray-600">{video.description}</p>}
        <div className="flex gap-3 mt-4">
          {video.previousVideoId && (
            <button
              onClick={() => router.push(`/subjects/${subjectId}/video/${video.previousVideoId}`)}
              className="btn-secondary"
            >
              ← Previous
            </button>
          )}
          {video.nextVideoId && (
            <button
              onClick={() => router.push(`/subjects/${subjectId}/video/${video.nextVideoId}`)}
              className="btn-primary"
              disabled={!progress?.isCompleted && !video.isCompleted}
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
