'use client';

import AddArrangmentModal from '@/components/modals/add-arrangement-modal';
import AddDeceasedModal from '@/components/modals/add-deceased-modal';
import { InfoModal } from '@/components/modals/deceased-info-modal';
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
      <InfoModal />
    </>
  );
};
