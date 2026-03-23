import Link from 'next/link';
import Image from 'next/image';
import { Subject } from '../types';

const FALLBACK_COLORS: Record<string, string> = {
  'typescript-masterclass': 'bg-blue-900',
  'docker-in-2-hours': 'bg-cyan-800',
  'sql-in-4-hours': 'bg-orange-800',
  'python-full-course': 'bg-yellow-700',
  'react-complete-guide': 'bg-sky-800',
  'javascript-fundamentals': 'bg-yellow-600',
};

export default function SubjectCard({ subject }: { subject: Subject }) {
  const bgColor = FALLBACK_COLORS[subject.slug] ?? 'bg-gray-800';

  return (
    <Link href={`/subjects/${subject.id}`} className="group block">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow h-full">
        {/* Thumbnail */}
        <div className={`relative w-full aspect-video ${bgColor} overflow-hidden`}>
          {subject.thumbnail ? (
            <Image
              src={subject.thumbnail}
              alt={subject.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              unoptimized
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-white text-4xl font-black opacity-30">
                {subject.title.slice(0, 2).toUpperCase()}
              </span>
            </div>
          )}
          {subject.isEnrolled && (
            <span className="absolute top-2 right-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full font-medium">
              Enrolled
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
            {subject.title}
          </h3>
          {subject.description && (
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">{subject.description}</p>
          )}
          <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
            <span>📚 {subject._count?.sections ?? 0} sections</span>
            <span>👥 {subject._count?.enrollments ?? 0} students</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
