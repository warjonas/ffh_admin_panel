'use client';

import React, { useEffect, useState } from 'react';
import * as z from 'zod';

import { Deceased, Removal } from '@prisma/client';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import Heading from '@/components/ui/heading';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn, formatter } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import useSWR, { SWRConfiguration } from 'swr';
import { useRemovalModal } from '@/hooks/use-removal-modal';

import DeceasedList from '@/components/deceased-list';
import NextDatePicker from '@/components/ui/custom-datepicker';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Props {
  initialData: Removal | null;
  deceasedData: Deceased[];
  params: { removalId: string };
}

const calculate_storageFee = (date1: Date, date2: Date, storageFee: any) => {
  let timeDifference = date2.getTime() - date1.getTime();

  let days = Math.round(timeDifference / (1000 * 3600 * 24));

  let fee = storageFee * days;

  return fee;
};

const formSchema = z.object({
  scheduledBy: z.string().min(1),
  deceasedId: z.string().min(1),
  dateRequested: z.date({
    required_error: 'Date removal is scheduled for',
  }),
  byUndertaker: z.string().min(1),
  doctorsFees: z.coerce.number().default(1),
  storageFee: z.coerce.number().default(350),
  storage: z.coerce.number().default(1),
  copyFee: z.coerce.number().default(5),
  copies: z.coerce.number().default(1),
  graveFee: z.coerce.number().default(1),
  gravediggerCost: z.coerce.number().default(1),
  adminFees: z.coerce.number().default(1),
  totalDue: z.coerce.number().default(1),
  deathRegistration: z.coerce.number().default(1),
  updatedBy: z.string(),
});

type RemovalFromValues = z.infer<typeof formSchema>;

const AddRemovalForm = ({ initialData, deceasedData, params }: Props) => {
  const [loading, setLoading] = useState(false);
  const [amountDue, setAmountDue] = useState(0);
  const [storage, setStorage] = useState(0);

  const { user, error, isLoading } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();
  const removalModal = useRemovalModal();

  const removalId = params.removalId;
  const deceasedId = searchParams.get('deceasedId');

  const toastMessage = 'Body removal scheduled successfully';
  const action = 'Save changes';

  const form = useForm<RemovalFromValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          dateRequested: new Date(initialData.dateRequested),
          updatedBy: initialData.updatedBy ? initialData.updatedBy : '',
        }
      : {
          scheduledBy: 'email',
          storageFee: 350,
          copyFee: 5,
          deathRegistration: 0,
          gravediggerCost: 0,

          adminFees: 0,
          graveFee: 0,
          doctorsFees: 0,
          copies: 0,
          storage: 0,
          deceasedId: 'id',

          byUndertaker: '',
          dateRequested: new Date(),
          updatedBy: '',
        },
  });

  const { control, handleSubmit, register, watch, setValue } = form;

  const onSubmit = async (data: RemovalFromValues) => {
    try {
      setLoading(true);
      data.storage = storage;
      data.totalDue = amountDue + storage;

      if (!error || !isLoading) {
        if (user?.email) {
          data.scheduledBy = user.email;
        }
      }

      if (deceasedId) {
        data.deceasedId = deceasedId;
      } else {
        throw new Error('Deceased Id is required');
      }

      if (initialData) {
        if (!error || !isLoading) {
          if (user?.name) {
            data.updatedBy = user.name;
          }
        }
        await axios.patch(`/api/removal/${initialData.id}`, data);
      } else {
        if (!error || !isLoading) {
          if (user?.name) {
            data.scheduledBy = user.name;
          }
        }
        await axios.post('/api/removal', data);
      }
      removalModal.onClose;
      router.push('/removals');
      router.refresh();

      toast.success('Body removal updated.');
    } catch (error) {
      console.log('Removal Form not submitted', error);

      if (deceasedId) {
        toast.error(`${error}`);
      } else {
        toast.error('Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  const onClose = () => {
    removalModal.onClose();
    form.reset();
    setStorage(0);
    setAmountDue(0);
    if (deceasedId && removalId) {
      router.push('/removals');
    } else if (deceasedId) {
      router.back();
    }
  };

  useEffect(() => {
    setAmountDue(0);
    setStorage(0);
  }, []);

  useEffect(() => {
    const total =
      Number(form.getValues().doctorsFees) +
      Number(form.getValues().gravediggerCost) +
      Number(form.getValues().adminFees) +
      Number(form.getValues().copies * 5) +
      Number(form.getValues().graveFee) +
      Number(form.getValues().deathRegistration);
    setAmountDue(total);
  }, [
    watch([
      'adminFees',
      'gravediggerCost',
      'doctorsFees',
      'storageFee',
      'copies',
      'deathRegistration',
      'graveFee',
      'deathRegistration',
    ]),
    amountDue,
  ]);

  useEffect(() => {
    let deceasedDate = deceasedData?.find((c) => c.id === deceasedId);

    if (deceasedDate && deceasedId) {
      setValue(
        'storage',
        calculate_storageFee(
          new Date(deceasedDate.removalDate),
          new Date(form.getValues().dateRequested),
          form.getValues().storageFee
        )
      );

      setStorage(
        calculate_storageFee(
          new Date(deceasedDate.removalDate),
          new Date(form.getValues().dateRequested),
          form.getValues().storageFee
        )
      );
    }
  }, [deceasedData, deceasedId, watch('dateRequested')]);

  return (
    <>
      <div className="flex flex-col  gap-x-2 mb-5">
        <div className="flex flex-col w-full ">
          <h1 className="text-lg">For the late: </h1>

          <DeceasedList
            items={deceasedData}
            disabled={initialData ? true : false}
          />
        </div>

        {deceasedId ? (
          <></>
        ) : (
          <h1 className="text-red-500 mt-2">
            Please select deceased from the list above
          </h1>
        )}
      </div>

      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mb-20 flex flex-col w-full gap-y-3"
        >
          <div className="flex flex-row gap-x-5">
            <FormField
              control={form.control}
              name="dateRequested"
              render={({ field }) => (
                <FormItem className="flex flex-col w-1/2">
                  <FormLabel className="mb-2">
                    Requested Removal Date*
                  </FormLabel>
                  <div className="relative">
                    <NextDatePicker
                      onChange={field.onChange}
                      value={field.value}
                      maxDate={new Date()}
                    />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="byUndertaker"
              render={({ field }) => (
                <FormItem className=" w-full">
                  <FormLabel className="font-semibold">By Undertaker</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Undertake name/Funeral Home name"
                      {...field}
                      maxLength={13}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <h1 className="text-xl font-semibold">Fees</h1>
          <FormField
            control={form.control}
            name="doctorsFees"
            render={({ field }) => (
              <FormItem className=" w-2/3">
                <FormLabel className="font-semibold">Doctors fees</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="3000"
                    {...field}
                    maxLength={13}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="deathRegistration"
            render={({ field }) => (
              <FormItem className=" w-2/3">
                <FormLabel className="font-semibold">
                  Death Registration
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="300"
                    {...field}
                    min={1}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex flex-row gap-x-5 items-center">
            <FormField
              control={form.control}
              name="storage"
              disabled
              render={({ field }) => (
                <FormItem className=" w-2/3">
                  <FormLabel className="font-semibold">Storage Fee</FormLabel>
                  <FormControl>
                    <Input placeholder="3" {...field} min={1} />
                  </FormControl>
                  <FormDescription className="text-sm">
                    Amount automatically calculated based on requested removal
                    date and the original removal date of the deceased.
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-row gap-x-5 items-center">
            <FormField
              control={form.control}
              name="copies"
              render={({ field }) => (
                <FormItem className=" w-2/3">
                  <FormLabel className="font-semibold">
                    Amount of Copies @ R5/copy
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="5"
                      {...field}
                      min={1}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <p className="text-lg">
              Total:{' '}
              <span className="font-semibold">
                {' '}
                {formatter.format(5 * watch('copies'))}
              </span>
            </p>
          </div>
          <FormField
            control={form.control}
            name="graveFee"
            render={({ field }) => (
              <FormItem className=" w-2/3">
                <FormLabel className="font-semibold">
                  Booking of Grave
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="5"
                    {...field}
                    min={1}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gravediggerCost"
            render={({ field }) => (
              <FormItem className=" w-2/3">
                <FormLabel className="font-semibold">
                  Gravedigger Cost
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="5"
                    {...field}
                    min={1}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="adminFees"
            render={({ field }) => (
              <FormItem className=" w-2/3">
                <FormLabel className="font-semibold">Admin Fees (R)</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="300"
                    {...field}
                    min={1}
                    type="number"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="my-5 flex flex-col gap-y-5 items-end">
            <h1 className="text-xl font-semibold text-end">
              Total Amount Due: {formatter.format(amountDue + storage)}{' '}
            </h1>
            <div className="flex flex-row w-1/2 gap-x-2">
              <Button
                className="font-semibold text-lg w-1/2"
                type="submit"
                disabled={deceasedId === null}
              >
                {action}
              </Button>
              <Button
                variant={'outline'}
                className="font-semibold text-lg w-1/2"
                onClick={onClose}
                type="button"
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};

export default AddRemovalForm;
