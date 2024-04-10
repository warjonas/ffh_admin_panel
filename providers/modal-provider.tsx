'use client';

import AddArrangmentModal from '@/components/modals/add-arrangement-modal';
import AddDeceasedModal from '@/components/modals/add-deceased-modal';
import AddRemovalModal from '@/components/modals/add-removal-modal';
import { InfoModal as DeceasedInfoModal } from '@/components/modals/deceased-info-modal';
import { InfoModal as ProgramInfoModal } from '@/components/modals/program-info-modal';
import { PaymentTypeModal } from '@/components/modals/payment-type-modal';
import { RemovalInfoModal } from '@/components/modals/removal-info-modal';
import RemovalReceiptModal from '@/components/modals/removal-receipt-modal';

import RemovalPaymentModal from '@/components/modals/process-Payment-Modal';

import { UpcomingRemovalsModal } from '@/components/modals/upcoming-removals-modal';
import { useEffect, useState } from 'react';
import AddCoffinModal from '@/components/modals/add-coffin';
import AddGraveModal from '@/components/modals/add-grave';
import AddTombstoneModal from '@/components/modals/add-tombstone';

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
      <PaymentTypeModal />
      <RemovalPaymentModal />
      <RemovalReceiptModal />
      <AddCoffinModal />
      <AddGraveModal />
      <AddTombstoneModal />
    </>
  );
};
