import { create } from 'zustand';

interface useReceiptModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useReceiptModal = create<useReceiptModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export const useRemovalReceiptModal = create<useReceiptModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
