'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import { authApi } from '../lib/api';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,

      clearAuth: () => {
        if (typeof window !== 'undefined') window.__accessToken = undefined;
        set({ user: null });
      },

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await authApi.login({ email, password });
          if (typeof window !== 'undefined') window.__accessToken = data.accessToken;
          set({ user: data.user });
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (email, password, name) => {
        set({ isLoading: true });
        try {
          const { data } = await authApi.register({ email, password, name });
          if (typeof window !== 'undefined') window.__accessToken = data.accessToken;
          set({ user: data.user });
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        await authApi.logout().catch(() => {});
        if (typeof window !== 'undefined') window.__accessToken = undefined;
        set({ user: null });
      },
    }),
    { name: 'auth-storage', partialize: (s) => ({ user: s.user }) }
  )
);
