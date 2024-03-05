import { create } from 'zustand';

interface useRemovalModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useRemovalModal = create<useRemovalModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export const useRemovalInfoModal = create<useRemovalModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export const useUpcomingRemovalsModal = create<useRemovalModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export const useRemovalReceiptModal = create<useRemovalModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
