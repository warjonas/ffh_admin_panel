import { create } from 'zustand';

interface useFuneralProgramModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useFuneralProgramModal = create<useFuneralProgramModalStore>(
  (set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
  })
);

export const useDeceasedInfoModal = create<useFuneralProgramModalStore>(
  (set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
  })
);
