import { create } from 'zustand';

interface usePaymentModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const usePaymentTypeModal = create<usePaymentModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export const useProcessPaymentModal = create<usePaymentModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
