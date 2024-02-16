import { create } from 'zustand';

interface useArrangementModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useArrangementModal = create<useArrangementModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
