'use client';
import { useEffect, useState } from 'react';
import { subjectsApi } from '../lib/api';
import { Subject } from '../types';
import SubjectCard from './SubjectCard';

export default function SubjectsList() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    subjectsApi.list()
      .then(({ data }) => setSubjects(data))
      .catch(() => setError('Failed to load courses'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-gray-100 rounded-xl aspect-[4/3] animate-pulse" />
      ))}
    </div>
  );

  if (error) return <div className="text-red-500">{error}</div>;
  if (!subjects.length) return <div className="text-gray-500">No courses available yet.</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {subjects.map((s) => <SubjectCard key={s.id} subject={s} />)}
    </div>
  );
}
