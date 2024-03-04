'use client';

import { Modal } from '@/components/ui/modal';
import { useRemovalReceiptModal } from '@/hooks/use-receipt-modal';
import { Removal, RemovalReceipt } from '@/types';
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

const formSchema = z.object({
  methodOfPayment: z.string(),
  receivedFrom: z.string().min(1),
  receivedAmount: z.coerce.number().min(1),
  issuedBy: z.string().min(1),
});

type RemovalReceiptFormValues = z.infer<typeof formSchema>;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const RemovalReceiptModal = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [outstandingBalance, setOutstandingBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const removalReceiptModal = useRemovalReceiptModal();
  const { user, isLoading: userLoading, error: userError } = useUser();

  const router = useRouter();
  const removalId = searchParams.get('removalId');

  const config: SWRConfiguration = {
    revalidateOnFocus: true,
  };

  const onClose = () => {
    removalReceiptModal.onClose();
    router.back();
  };

  const {
    data,
    error,
    isLoading,
  }: { data: Removal[]; error: any; isLoading: any } = useSWR(
    `/api/removal`,
    fetcher,
    config
  );

  const {
    data: individualData,
    error: individualError,
    isLoading: individualLoading,
  }: { data: Removal; error: any; isLoading: any } = useSWR(
    removalId ? `/api/removal/${removalId}` : null,
    fetcher,
    config
  );

  const form = useForm<RemovalReceiptFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      issuedBy: 'username',
      methodOfPayment: '',
      receivedAmount: 0,
      receivedFrom: '',
    },
  });
  const onSubmit = async (data: RemovalReceiptFormValues) => {
    setLoading(true);

    try {
      if (!error || !userLoading) {
        if (user?.name) {
          data.issuedBy = user.name;
        }
      }

      await axios.patch(`/api/removal/receipt/${removalId}`, data);

      removalReceiptModal.onClose();
      router.push(`/payments`);
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const { control, handleSubmit, register, formState, watch, setValue } = form;

  useEffect(() => {
    setIsMounted(true);
  });

  if (!isMounted) {
    return null;
  }

  if (isLoading)
    return (
      <Modal
        title={`Loading`}
        description=""
        isOpen={removalReceiptModal.isOpen}
        onClose={onClose}
      >
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Calculating outstanding Balance...
          </span>
        </div>
      </Modal>
    );

  // if(receipts){
  //   const totalPayments = receipts.reduce((total,removalReceipt ) =>{
  //     return total + removalReceipt.receivedAmount
  //   }, 0)

  //   setOutstandingBalance(totalPayments)
  // }

  if (error)
    return (
      <Modal
        title={`Error Occurred`}
        description=""
        isOpen={removalReceiptModal.isOpen}
        onClose={onClose}
      >
        An error occurred. Contact your technical administrator.
      </Modal>
    );

  return (
    <Modal
      title="New Payment Receipt"
      description="Record payment made for the removal of the deceased"
      isOpen={removalReceiptModal.isOpen}
      onClose={onClose}
    >
      <div className="flex flex-col gap-y-2 mb-5">
        <h2>For the removal of:</h2>
        <BodyRemovalList items={data} disabled={false} />
      </div>

      {individualLoading && (
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Calculating outstanding Balance...
          </span>
        </div>
      )}

      {individualData && (
        <div className="flex flex-col gap-y-3">
          <h1 className="font-semibold text-lg">
            Outstanding Balance is:{' '}
            {formatter.format(individualData.outstandingBalance)}{' '}
          </h1>
          <hr className="w-full" />

          <Form {...form}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-y-3"
            >
              <FormField
                control={form.control}
                name="methodOfPayment"
                render={({ field }) => (
                  <FormItem className=" w-full md:w-1/2 xl:w-1/2">
                    <FormLabel className="font-semibold">
                      Method Of Payment
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. EFT" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="receivedAmount"
                render={({ field }) => (
                  <FormItem className=" w-full md:w-1/2 xl:w-1/2">
                    <FormLabel className="font-semibold">
                      Amount Received
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 4500" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="receivedFrom"
                render={({ field }) => (
                  <FormItem className=" w-full md:w-1/2 xl:w-1/2">
                    <FormLabel className="font-semibold">
                      Payment Made By
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Marvin Rensburg" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button variant="default" type="submit">
                Confirm Payment
              </Button>
            </form>
          </Form>
        </div>
      )}
    </Modal>
  );
};

export default RemovalReceiptModal;
