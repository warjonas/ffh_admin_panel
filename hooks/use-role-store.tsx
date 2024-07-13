import { create } from 'zustand';

interface useRoleStore {
  userRole: string;
  onUpdate: (role: string) => void;
}

export const useRole = create<useRoleStore>((set) => ({
  userRole: '',
  onUpdate: (state) => set({ userRole: state }),
}));
