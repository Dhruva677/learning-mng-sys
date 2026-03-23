'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { subjectsApi, progressApi } from '../../../lib/api';
import { SubjectTree, SubjectProgress } from '../../../types';
import { useAuthStore } from '../../../store/authStore';

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function SubjectPage() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const [subject, setSubject] = useState<SubjectTree | null>(null);
  const [progress, setProgress] = useState<SubjectProgress | null>(null);
  const [enrolling, setEnrolling] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openSections, setOpenSections] = useState<Set<number>>(new Set());

  useEffect(() => {
    const id = Number(subjectId);

    if (user) {
      // Authenticated: load tree (has lock/complete info)
      Promise.all([
        subjectsApi.getTree(id),
        progressApi.getSubject(id),
      ])
        .then(([treeRes, progressRes]) => {
          setSubject(treeRes.data as SubjectTree);
          setProgress(progressRes.data);
          // Open all sections by default
          setOpenSections(new Set(treeRes.data.sections.map((s: { id: number }) => s.id)));
        })
        .catch(() => {
          // Fallback to basic subject info
          subjectsApi.get(id).then(({ data }) => setSubject(data as unknown as SubjectTree));
        })
        .finally(() => setLoading(false));
    } else {
      subjectsApi.get(id)
        .then(({ data }) => setSubject(data as unknown as SubjectTree))
        .finally(() => setLoading(false));
    }
  }, [subjectId, user]);

  const handleEnroll = async () => {
    if (!user) { router.push('/login'); return; }
    setEnrolling(true);
    try {
      await subjectsApi.enroll(Number(subjectId));
      const { data } = await subjectsApi.getFirstVideo(Number(subjectId));
      router.push(`/subjects/${subjectId}/video/${data.id}`);
    } finally { setEnrolling(false); }
  };

  const handleContinue = async () => {
    const { data } = await subjectsApi.getFirstVideo(Number(subjectId));
    router.push(`/subjects/${subjectId}/video/${data.id}`);
  };

  const toggleSection = (id: number) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const totalVideos = subject?.sections?.reduce((acc, s) => acc + s.videos.length, 0) ?? 0;
  const totalDuration = subject?.sections?.reduce(
    (acc, s) => acc + s.videos.reduce((a, v) => a + v.durationSeconds, 0), 0
  ) ?? 0;

  if (loading) return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-4">
      <div className="h-8 bg-gray-200 rounded animate-pulse w-1/2" />
      <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
      <div className="h-32 bg-gray-100 rounded animate-pulse mt-6" />
    </div>
  );

  if (!subject) return <div className="p-10 text-red-500">Subject not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start gap-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{subject.title}</h1>
          {subject.description && (
            <p className="mt-3 text-gray-600 text-base leading-relaxed">{subject.description}</p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
            <span>📚 {subject._count?.sections ?? subject.sections?.length ?? 0} sections</span>
            <span>🎬 {totalVideos} videos</span>
            <span>⏱ {Math.round(totalDuration / 60)} min total</span>
            <span>👥 {subject._count?.enrollments ?? 0} students</span>
          </div>
        </div>

        {/* CTA */}
        <div className="shrink-0">
          {subject.isEnrolled ? (
            <button onClick={handleContinue} className="btn-primary px-6 py-3 text-base">
              Continue Learning →
            </button>
          ) : (
            <button onClick={handleEnroll} className="btn-primary px-6 py-3 text-base" disabled={enrolling}>
              {enrolling ? 'Enrolling...' : 'Enroll Now — Free'}
            </button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      {progress && progress.total > 0 && (
        <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4">
          <div className="flex justify-between text-sm text-blue-700 mb-2">
            <span className="font-medium">Your progress</span>
            <span>{progress.percentage}% complete</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
          <p className="text-xs text-blue-500 mt-1.5">{progress.completed} of {progress.total} videos completed</p>
        </div>
      )}

      {/* Syllabus */}
      {subject.sections && subject.sections.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Course Syllabus</h2>
          <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-200">
            {subject.sections.map((section, si) => {
              const isOpen = openSections.has(section.id);
              const sectionDuration = section.videos.reduce((a, v) => a + v.durationSeconds, 0);
              return (
                <div key={section.id}>
                  {/* Section header */}
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-gray-400 w-5">{si + 1}</span>
                      <span className="font-semibold text-gray-800">{section.title}</span>
                      <span className="text-xs text-gray-400">
                        {section.videos.length} videos · {Math.round(sectionDuration / 60)} min
                      </span>
                    </div>
                    <span className="text-gray-400 text-sm">{isOpen ? '▲' : '▼'}</span>
                  </button>

                  {/* Videos list */}
                  {isOpen && (
                    <div className="divide-y divide-gray-100">
                      {section.videos.map((video, vi) => {
                        const isLocked = user && video.isUnlocked === false;
                        const isCompleted = video.isCompleted;
                        return (
                          <div
                            key={video.id}
                            className={`flex items-center gap-4 px-5 py-3 ${
                              isLocked ? 'opacity-50' : 'hover:bg-gray-50'
                            } transition-colors`}
                          >
                            {/* Icon */}
                            <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-sm
                              ${isCompleted ? 'bg-green-100 text-green-600' : isLocked ? 'bg-gray-100 text-gray-400' : 'bg-blue-50 text-blue-500'}">
                              {isCompleted ? '✓' : isLocked ? '🔒' : '▶'}
                            </div>

                            {/* Title */}
                            <div className="flex-1 min-w-0">
                              {!isLocked && subject.isEnrolled ? (
                                <button
                                  onClick={() => router.push(`/subjects/${subjectId}/video/${video.id}`)}
                                  className="text-sm text-gray-800 hover:text-blue-600 transition-colors text-left truncate block w-full"
                                >
                                  {vi + 1}. {video.title}
                                </button>
                              ) : (
                                <span className="text-sm text-gray-600 truncate block">
                                  {vi + 1}. {video.title}
                                </span>
                              )}
                            </div>

                            {/* Duration */}
                            <span className="text-xs text-gray-400 shrink-0">
                              {formatDuration(video.durationSeconds)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Enroll CTA at bottom */}
      {!subject.isEnrolled && (
        <div className="mt-8 p-6 bg-gray-900 rounded-xl text-center">
          <p className="text-white font-semibold text-lg mb-1">Ready to start learning?</p>
          <p className="text-gray-400 text-sm mb-4">Enroll for free and get instant access to all videos.</p>
          <button onClick={handleEnroll} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors" disabled={enrolling}>
            {enrolling ? 'Enrolling...' : 'Enroll Now — It\'s Free'}
          </button>
        </div>
      )}
    </div>
  );
}
