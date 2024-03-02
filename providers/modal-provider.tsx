'use client';

import AddArrangmentModal from '@/components/modals/add-arrangement-modal';
import AddDeceasedModal from '@/components/modals/add-deceased-modal';
import AddRemovalModal from '@/components/modals/add-removal-modal';
import { InfoModal as DeceasedInfoModal } from '@/components/modals/deceased-info-modal';
import { InfoModal as ProgramInfoModal } from '@/components/modals/program-info-modal';
import { RemovalInfoModal } from '@/components/modals/removal-info-modal';
import { UpcomingRemovalsModal } from '@/components/modals/upcoming-removals-modal';
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
      <AddRemovalModal />
      <DeceasedInfoModal />
      <ProgramInfoModal />
      <RemovalInfoModal />
      <UpcomingRemovalsModal />
    </>
  );
};
