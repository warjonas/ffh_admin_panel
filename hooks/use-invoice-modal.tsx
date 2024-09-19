import { create } from 'zustand';

interface useInvoiceStore {
  isOpen: boolean;
  onClose: () => void;
  onOpen: (id: string) => void;
  id: string;
}

export const useInvoice = create<useInvoiceStore>((set) => ({
  isOpen: false,
  onClose: () => set({ isOpen: false }),
  onOpen: (id: string) => set({ id: id, isOpen: true }),
  id: '',
}));

export const useArrangeInvoice = create<useInvoiceStore>((set) => ({
  isOpen: false,
  onClose: () => set({ isOpen: false }),
  onOpen: (id: string) => set({ id: id, isOpen: true }),
  id: '',
}));
