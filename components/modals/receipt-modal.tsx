'use client';

import { useEffect, useState } from 'react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import {
  useReceiptModal,
  useRemovalReceiptModal,
} from '@/hooks/use-receipt-modal';

export const ReceiptModal = () => {
  const [isMounted, setIsMounted] = useState(false);
  const receiptModal = useReceiptModal();
  const removalReceiptModal = useRemovalReceiptModal();

  const removalModalOpen = () => {
    removalReceiptModal.onOpen();

    receiptModal.onClose();
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title="Create payment receipt for?"
      description="Body removal payments or Funeral Arrangement payments"
      isOpen={receiptModal.isOpen}
      onClose={receiptModal.onClose}
    >
      <div className="pt-6 space-x-2 flex items-center justify-center w-full">
        <Button variant={'default'} onClick={removalModalOpen}>
          Body Removal
        </Button>
        <Button variant={'default'} onClick={() => {}}>
          Funeral Arrangement
        </Button>
      </div>
    </Modal>
  );
};
