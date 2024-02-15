import { create } from 'zustand';

interface useDeceasedModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useDeceasedModal = create<useDeceasedModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
