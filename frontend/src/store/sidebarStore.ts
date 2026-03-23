import { create } from 'zustand';
import { SubjectTree } from '../types';

interface SidebarState {
  tree: SubjectTree | null;
  isOpen: boolean;
  setTree: (tree: SubjectTree) => void;
  toggleSidebar: () => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  tree: null,
  isOpen: true,
  setTree: (tree) => set({ tree }),
  toggleSidebar: () => set((s) => ({ isOpen: !s.isOpen })),
}));
