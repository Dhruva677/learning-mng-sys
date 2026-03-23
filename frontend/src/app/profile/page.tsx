'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => { if (!user) router.push('/login'); }, [user, router]);
  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div>
          <p className="text-sm text-gray-500">Name</p>
          <p className="font-medium text-gray-900">{user.name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-medium text-gray-900">{user.email}</p>
        </div>
        <div className="pt-4 border-t border-gray-100">
          <button onClick={async () => { await logout(); router.push('/login'); }} className="btn-secondary">
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
