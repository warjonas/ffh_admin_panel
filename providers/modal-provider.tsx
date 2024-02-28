'use client';

import AddArrangmentModal from '@/components/modals/add-arrangement-modal';
import AddDeceasedModal from '@/components/modals/add-deceased-modal';
import { InfoModal as DeceasedInfoModal } from '@/components/modals/deceased-info-modal';
import { InfoModal as ProgramInfoModal } from '@/components/modals/program-info-modal';
import { useEffect, useState } from 'react';

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <AddDeceasedModal />
      <AddArrangmentModal />
      <DeceasedInfoModal />
      <ProgramInfoModal />
    </>
  );
};
