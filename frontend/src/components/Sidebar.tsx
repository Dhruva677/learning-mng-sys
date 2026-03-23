'use client';
import Link from 'next/link';
import clsx from 'clsx';
import { useSidebarStore } from '../store/sidebarStore';
import { Video } from '../types';

interface SidebarProps {
  subjectId: number;
  currentVideoId?: number;
}

export default function Sidebar({ subjectId, currentVideoId }: SidebarProps) {
  const { tree, isOpen, toggleSidebar } = useSidebarStore();

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed top-20 left-0 z-20 bg-white border border-gray-200 rounded-r-md p-1.5 shadow-sm text-xs"
        aria-label="Toggle sidebar"
      >
        {isOpen ? '◀' : '▶'}
      </button>

      <aside className={clsx(
        'fixed top-14 left-0 h-[calc(100vh-3.5rem)] bg-white border-r border-gray-200 overflow-y-auto transition-all duration-300 z-10',
        isOpen ? 'w-72' : 'w-0 overflow-hidden'
      )}>
        <div className="p-4 min-w-[18rem]">
          <h2 className="font-semibold text-gray-900 mb-4 truncate">{tree?.title ?? 'Course Content'}</h2>
          {tree?.sections.map((section) => (
            <div key={section.id} className="mb-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 px-3">
                {section.title}
              </h3>
              <div className="space-y-0.5">
                {section.videos.map((video: Video) => {
                  if (!video.isUnlocked) {
                    return (
                      <div key={video.id} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 cursor-not-allowed select-none">
                        <span>🔒</span>
                        <span className="truncate">{video.title}</span>
                      </div>
                    );
                  }
                  return (
                    <Link
                      key={video.id}
                      href={`/subjects/${subjectId}/video/${video.id}`}
                      className={clsx(
                        'flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors',
                        video.id === currentVideoId
                          ? 'bg-blue-100 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      )}
                    >
                      <span>{video.isCompleted ? '✅' : '▶'}</span>
                      <span className="truncate">{video.title}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
