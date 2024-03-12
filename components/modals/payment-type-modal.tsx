'use client';

import { useCallback, useEffect, useState } from 'react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import {
  usePaymentTypeModal,
  useProcessPaymentModal,
} from '@/hooks/use-payment-modal';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export const PaymentTypeModal = () => {
  const [isMounted, setIsMounted] = useState(false);
  const paymentModal = usePaymentTypeModal();
  const processPaymentModal = useProcessPaymentModal();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const paymentModalOpen = (type: string) => {
    processPaymentModal.onOpen();
    router.push(pathname + '?' + createQueryString('type', type));

    paymentModal.onClose();
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
      isOpen={paymentModal.isOpen}
      onClose={paymentModal.onClose}
    >
      <div className="pt-6 space-x-2 flex items-center justify-center w-full">
        <Button variant={'default'} onClick={() => paymentModalOpen('removal')}>
          Body Removal
        </Button>
        <Button
          variant={'default'}
          onClick={() => paymentModalOpen('arrangement')}
        >
          Funeral Arrangement
        </Button>
      </div>
    </Modal>
  );
};
