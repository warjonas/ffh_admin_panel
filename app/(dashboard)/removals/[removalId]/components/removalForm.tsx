'use client';

import React, { useEffect, useState } from 'react';
import * as z from 'zod';

import { Removal } from '@prisma/client';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import Heading from '@/components/ui/heading';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface RemovalFormProps {
  initialData: Removal | null;
}

const formSchema = z.object({
  lastname: z.string().min(1),
  firstName: z.string().min(1),
  idNumber: z.string().min(1),
  address: z.string().min(1),
  scheduledBy: z.string().min(1),

  dateRemoved: z.date({
    required_error: 'Date removal is scheduled for',
  }),
  byUndertaker: z.string().min(1),
  doctorsFees: z.coerce.number().default(1),
  storageFee: z.coerce.number().default(300),
  storageDays: z.coerce.number().default(1),
  copyFee: z.coerce.number().default(5),
  copies: z.coerce.number().default(1),
  graveFee: z.coerce.number().default(1),
  casket: z.coerce.number().default(1),
  gravediggerCost: z.coerce.number().default(1),
  adminFees: z.coerce.number().default(1),
  totalDue: z.coerce.number().default(1),
});

type RemovalFromValues = z.infer<typeof formSchema>;

const RemovalForm = ({ initialData }: RemovalFormProps) => {
  const [loading, setLoading] = useState(false);
  const [amountDue, setAmountDue] = useState(0);
  const router = useRouter();

  const { user, error, isLoading } = useUser();

  const title = initialData ? `Update Removal Sheet` : 'Body Removal Sheet';
  const description = initialData
    ? 'Make changes to existing scheduled body removal.'
    : 'Schedule a new body removal';
  const toastMessage = initialData
    ? 'Changes successfully applied.'
    : 'Body removal scheduled successfully';
  const action = initialData ? 'Save changes' : 'Schedule Removal';

  const form = useForm<RemovalFromValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
        }
      : {
          lastname: '',
          firstName: '',
          idNumber: '',
          address: '',
          scheduledBy: 'email',
          storageFee: 300,
          copyFee: 5,
          byUndertaker: '',
        },
  });

  const { control, handleSubmit, register, watch } = form;

  const onSubmit = async (data: RemovalFromValues) => {
    try {
      setLoading(true);
      data.totalDue = amountDue;

      if (!error || !isLoading) {
        if (user?.email) {
          data.scheduledBy = user.email;
        }
      }

      if (initialData) {
        await axios.patch(`/api/removal/${initialData.id}`, data);
      } else {
        await axios.post('/api/removal', data);
      }
      router.push('/removals');
      router.refresh();

      toast.success(toastMessage);
    } catch (error) {
      console.log('Submit Error', error);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const total =
      Number(form.getValues().doctorsFees) +
      Number(form.getValues().gravediggerCost) +
      Number(form.getValues().adminFees) +
      Number(form.getValues().storageDays * 300) +
      Number(form.getValues().copies * 5) +
      Number(form.getValues().graveFee);

    setAmountDue(total);
  }, [
    watch([
      'adminFees',
      'gravediggerCost',
      'doctorsFees',
      'storageFee',
      'copies',
      'graveFee',
    ]),
  ]);

  return (
    <>
      <Heading title={title} subtitle={description} />
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mb-20 flex flex-col w-full xl:w-1/2 gap-y-3"
        >
          <div className="flex flex-row gap-x-5">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className=" w-full md:w-1/2 xl:w-1/2">
                  <FormLabel className="font-semibold">Last Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="John" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastname"
              render={({ field }) => (
                <FormItem className=" w-full md:w-1/2 xl:w-1/2">
                  <FormLabel className="font-semibold">Last Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Doe" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="idNumber"
            render={({ field }) => (
              <FormItem className=" w-full">
                <FormLabel className="font-semibold">ID Number</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="9404110254803"
                    {...field}
                    maxLength={13}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className=" w-full">
                <FormLabel className="font-semibold">Address</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="17 Main Road, Bethelsdorp"
                    {...field}
                    maxLength={13}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex flex-row gap-x-5">
            <FormField
              control={form.control}
              name="dateRemoved"
              render={({ field }) => (
                <FormItem className="flex flex-col w-1/2">
                  <FormLabel className="mb-2">Date removed*</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal ',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span className="text-gray-400">Select date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto bg-primary-foreground p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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

          <div className="flex flex-row gap-x-5 items-center">
            <FormField
              control={form.control}
              name="storageDays"
              render={({ field }) => (
                <FormItem className=" w-2/3">
                  <FormLabel className="font-semibold">
                    Storage Days @ R300/day
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="3"
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
                {formatter.format(300 * watch('storageDays'))}
              </span>
            </p>
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
            name="casket"
            render={({ field }) => (
              <FormItem className=" w-2/3">
                <FormLabel className="font-semibold">Admin Fees (R)</FormLabel>
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
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="my-5 flex flex-col gap-y-5 items-end">
            <h1 className="text-xl font-semibold text-end">
              Total Amount Due: {formatter.format(amountDue)}{' '}
            </h1>
            <Button className="font-semibold text-lg w-1/3">{action}</Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default RemovalForm;
