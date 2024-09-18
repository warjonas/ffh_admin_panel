import { Arrangement, Removal } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel } from './ui/form';
import { formatter } from '@/lib/utils';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useSearchParams } from 'next/navigation';
import useSWR, { SWRConfiguration } from 'swr';
import { Invoice } from '@prisma/client';

interface PaymentFormProps {
  onSubmit: (data: PaymentFormValues) => void;
  loading: boolean;
}

const formSchema = z.object({
  methodOfPayment: z.string().min(1),
  receivedFrom: z.string().min(1),
  receivedAmount: z.coerce.number().min(1),
  issuedBy: z.string().min(1),
  outstandingBalance: z.coerce.number(),
  paidUp: z.boolean().default(false),
});

type PaymentFormValues = z.infer<typeof formSchema>;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const PaymentForm = ({ onSubmit, loading }: PaymentFormProps) => {
  const [outstandingBalance, setOutstandingBalance] = useState(0);

  const searchParams = useSearchParams();
  const removalId = searchParams.get('removalId');
  const arrangementId = searchParams.get('arrangementId');
  const invoiceId = searchParams.get('invoiceId');
  const type = searchParams.get('type');

  const config: SWRConfiguration = {
    revalidateOnFocus: true,
  };

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      issuedBy: 'username',
      methodOfPayment: '',
      receivedAmount: 0,
      receivedFrom: '',
      outstandingBalance: 0,
      paidUp: false,
    },
  });

  useEffect(() => {}, [arrangementId, removalId]);

  const { control, handleSubmit, register, formState, watch, setValue } = form;

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

  const {
    data: individualInvoiceData,
    error: individualInvoiceError,
    isLoading: individualInvoiceisLoading,
  }: { data: Invoice; error: any; isLoading: any } = useSWR(
    invoiceId ? `/api/invoice/${invoiceId}` : null,
    fetcher,
    config
  );

  useEffect(() => {
    switch (type) {
      case 'removal':
        if (!individualRemovalisLoading && removalId) {
          setOutstandingBalance(individualRemovalData.outstandingBalance);
        }
        break;
      case 'arrangement':
        if (!individualArrangementisLoading && arrangementId) {
          setOutstandingBalance(individualArrangementData.outstandingBalance);
        }
        break;
      case 'custom':
        if (!individualInvoiceisLoading && invoiceId) {
          setOutstandingBalance(individualInvoiceData.total);
        }
        break;
    }
  }, [
    arrangementId,
    removalId,
    invoiceId,
    type,
    individualRemovalisLoading,
    individualArrangementisLoading,
    individualInvoiceisLoading,
  ]);

  return (
    <div className="flex flex-col gap-y-3">
      <h1 className="font-semibold text-lg">
        Outstanding Balance is: {formatter.format(outstandingBalance)}
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
                <FormLabel className="font-semibold">Amount Received</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. 4500"
                    {...field}
                    type="number"
                    max={outstandingBalance}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="receivedFrom"
            render={({ field }) => (
              <FormItem className=" w-full md:w-1/2 xl:w-1/2">
                <FormLabel className="font-semibold">Payment Made By</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Marvin Rensburg" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <Button variant="default" type="submit" disabled={loading}>
            Confirm Payment
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default PaymentForm;
