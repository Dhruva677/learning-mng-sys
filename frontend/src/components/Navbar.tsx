'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/authStore';

// We use a custom event to open the chatbot from the navbar button
function openChatbot() {
  window.dispatchEvent(new CustomEvent('open-chatbot'));
}

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between sticky top-0 z-30 border-b border-white/10">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-xl font-extrabold tracking-tight text-white">
          Kodemy
        </Link>
        <button
          onClick={openChatbot}
          className="hidden sm:inline-flex items-center gap-1.5 text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2.5 py-1 rounded-full font-medium hover:bg-blue-500/30 transition-colors cursor-pointer"
        >
          ✦ AI Assistant
        </button>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/" className="text-sm text-gray-300 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10">
          Home
        </Link>
        {user ? (
          <>
            <Link href="/profile" className="text-sm text-gray-300 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10">
              {user.name}
            </Link>
            <button
              onClick={async () => { await logout(); router.push('/login'); }}
              className="text-sm border border-white/20 text-white px-4 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-sm border border-white/20 text-white px-4 py-1.5 rounded-lg hover:bg-white/10 transition-colors">
              Log in
            </Link>
            <Link href="/register" className="text-sm bg-white text-gray-900 font-semibold px-4 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
