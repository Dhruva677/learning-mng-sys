'use client';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../lib/api';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, clearAuth } = useAuthStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // If we have a persisted user, try to restore the access token via refresh cookie
    if (user) {
      authApi
        .refresh()
        .then(({ data }) => {
          if (typeof window !== 'undefined') window.__accessToken = data.accessToken;
        })
        .catch(() => {
          // Refresh failed — clear stale user from store
          clearAuth();
        })
        .finally(() => setReady(true));
    } else {
      setReady(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Avoid flash of unauthenticated content while restoring session
  if (!ready) return null;

  return <>{children}</>;
}
