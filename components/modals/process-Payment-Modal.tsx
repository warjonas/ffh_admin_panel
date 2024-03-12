'use client';

import { Modal } from '@/components/ui/modal';
import { useProcessPaymentModal } from '@/hooks/use-payment-modal';
import { Arrangement, Removal, RemovalReceipt } from '@/types';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import useSWR, { SWRConfiguration } from 'swr';
import BodyRemovalList from '../body-removal-list';
import { formatter } from '@/lib/utils';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUser } from '@auth0/nextjs-auth0/client';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import ArrangementList from '../arrangment-list';
import PaymentForm from '../paymentForm';

const formSchema = z.object({
  methodOfPayment: z.string().min(1),
  receivedFrom: z.string().min(1),
  receivedAmount: z.coerce.number().min(1),
  issuedBy: z.string().min(1),
  outstandingBalance: z.coerce.number(),
  paidUp: z.boolean().default(false),
});

type RemovalReceiptFormValues = z.infer<typeof formSchema>;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ProcessPaymentModal = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const paymentReceiptModal = useProcessPaymentModal();
  const { user, isLoading: userLoading, error: userError } = useUser();

  const router = useRouter();
  const removalId = searchParams.get('removalId');
  const arrangementId = searchParams.get('arrangementId');
  const deceasedId = searchParams.get('deceasedId');
  const type = searchParams.get('type');

  const config: SWRConfiguration = {
    revalidateOnFocus: true,
  };

  const onClose = () => {
    paymentReceiptModal.onClose();
    if (deceasedId && removalId) {
      router.push('/removals');
    } else {
      router.back();
    }
  };

  const {
    data: removalData,
    error: removalError,
    isLoading: removalisLoading,
  }: { data: Removal[]; error: any; isLoading: any } = useSWR(
    `/api/removal`,
    fetcher,
    config
  );

  const {
    data: funeralData,
    error: funeralError,
    isLoading: funeralisLoading,
  }: { data: Arrangement[]; error: any; isLoading: any } = useSWR(
    `/api/arrangement`,
    fetcher,
    config
  );

  const {
    data: individualRemovalData,
    error: individualRemovalError,
    isLoading: individualRemovalisLoading,
  }: { data: Removal; error: any; isLoading: any } = useSWR(
    removalId ? `/api/removal/${removalId}` : null,
    fetcher,
    config
  );

  const {
    data: individualArrangementData,
    error: individualArrangementError,
    isLoading: individualArrangementisLoading,
  }: { data: Arrangement; error: any; isLoading: any } = useSWR(
    arrangementId ? `/api/arrangement/${arrangementId}` : null,
    fetcher,
    config
  );

  const onSubmit = async (data: RemovalReceiptFormValues) => {
    setLoading(true);

    try {
      if (!userError || !userLoading) {
        if (user?.name) {
          data.issuedBy = user.name;
        }
      }

      if (type === 'removal') {
        data.outstandingBalance =
          individualRemovalData.outstandingBalance - data.receivedAmount;

        if (data.outstandingBalance === 0) {
          data.paidUp = true;
        }

        await axios.post(`/api/receipt/removal/${removalId}`, data);
      } else if (type === 'arrangement') {
        data.outstandingBalance =
          individualArrangementData.outstandingBalance - data.receivedAmount;

        if (data.outstandingBalance === 0) {
          data.paidUp = true;
        }
        await axios.post(`/api/receipt/arrangement/${arrangementId}`, data);
      }

      paymentReceiptModal.onClose();
      toast.success('Payment Processed Successfully!');

      router.push(`/payments`);
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong. Try again!');
    } finally {
      setLoading(false);
    }
  };

  const heading =
    type === 'removal'
      ? 'For the removal of:'
      : 'For the funeral arrangement of:';

  const subtitle =
    type === 'removal'
      ? 'Record payment made for the removal of the deceased:'
      : 'Record payment made for the arrangement of the deceased';

  useEffect(() => {
    setIsMounted(true);
  });

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title="New Payment Receipt"
      description={subtitle}
      isOpen={paymentReceiptModal.isOpen}
      onClose={onClose}
    >
      <div className="flex flex-col gap-y-2 mb-5">
        <h2>{heading}</h2>

        {type === 'removal' ? (
          <BodyRemovalList items={removalData} disabled={false} />
        ) : (
          <ArrangementList items={funeralData} disabled={false} />
        )}
      </div>

      {!individualRemovalisLoading ? (
        <PaymentForm onSubmit={onSubmit} />
      ) : (
        !individualArrangementisLoading && <PaymentForm onSubmit={onSubmit} />
      )}
    </Modal>
  );
};

export default ProcessPaymentModal;
