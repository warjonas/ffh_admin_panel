'use client';

import React, { useEffect, useState } from 'react';
import * as z from 'zod';

import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Input } from '../ui/input';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { useUser } from '@auth0/nextjs-auth0/client';
import useSWR, { SWRConfiguration } from 'swr';
import { Deceased } from '@prisma/client';
import { useDeceasedModal } from '@/hooks/use-deceased-modal';
import NextDatePicker from '../ui/custom-datepicker';

const formSchema = z.object({
  ffhMemberNo: z.string(),
  lastName: z.string().min(1),
  firstNames: z.string().min(1),
  idNumber: z.string().min(13).max(13),
  dateOfDeath: z.date({ required_error: 'Date of Death is required' }),
  dateOfBirth: z.date({ required_error: 'Date of Birth is required' }),

  removalDate: z.date({ required_error: 'Date of removal is required' }),
  removalFrom: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
  }),
  deathCertificateRecipient: z.string().min(1),

  createdBy: z.string(),
  updatedBy: z.string(),
});

type DeceasedFormValues = z.infer<typeof formSchema>;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const AddDeceasedModal = () => {
  const deceasedModal = useDeceasedModal();
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  const [isMounted, setIsMounted] = useState(false);
  const { user, isLoading: userLoading, error } = useUser();
  const router = useRouter();

  const id = searchParams.get('deceasedId');

  const config: SWRConfiguration = {
    revalidateOnMount: true,
  };

  const {
    data: deceased,
    error: dataError,
    isLoading,
  }: { data: Deceased; error: any; isLoading: any } = useSWR(
    id !== null ? `/api/deceased/${id}` : null,
    fetcher,
    config
  );

  const form = useForm<DeceasedFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dateOfDeath: new Date(),
      dateOfBirth: new Date(),

      ffhMemberNo: '',
      lastName: '',
      firstNames: '',
      idNumber: '',
      removalDate: new Date(),
      removalFrom: {
        street: '',
        city: '',
      },
      deathCertificateRecipient: '',
      createdBy: 'email',
      updatedBy: '',
    },
  });

  const onSubmit = async (data: DeceasedFormValues) => {
    setLoading(true);

    try {
      if (deceased) {
        if (!error || !userLoading) {
          if (user?.name) {
            data.updatedBy = user.name;
          }
        }
        await axios.patch(`/api/deceased/${deceased.id}`, data);
      } else {
        if (!error || !userLoading) {
          if (user?.name) {
            data.createdBy = user.name;
          }
        }
        await axios.post('/api/deceased', data);
      }

      toast.success('Deceased Details added!');
      form.reset();

      deceasedModal.onClose();
      router.push(`/deceased`);
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const { control, handleSubmit, register, formState, watch, setValue } = form;

  const onClose = () => {
    deceasedModal.onClose();
    form.reset();

    router.push('/deceased');
    router.refresh();
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!id) form.reset();
  }, [id]);

  useEffect(() => {
    if (deceased) {
      setValue('firstNames', deceased.firstNames);
      setValue('lastName', deceased.lastName);
      setValue('dateOfBirth', new Date(deceased.dateOfBirth));
      setValue('dateOfDeath', new Date(deceased.dateOfDeath));
      setValue('deathCertificateRecipient', deceased.deathCertificateRecipient);
      setValue('ffhMemberNo', deceased.ffhMemberNo);
      setValue('idNumber', deceased.idNumber);
      setValue('removalFrom.city', deceased.removalFrom.city);

      setValue('removalFrom.street', deceased.removalFrom.street);

      setValue('removalDate', new Date(deceased.removalDate));
    }
  }, [deceased]);

  if (!isMounted) {
    return null;
  }

  if (isLoading && !dataError) {
    return (
      <Modal
        title={`Loading`}
        description=""
        isOpen={deceasedModal.isOpen}
        onClose={deceasedModal.onClose}
      >
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      title="Add New Deceased "
      description="Upload deceased details"
      isOpen={deceasedModal.isOpen}
      onClose={onClose}
    >
      <hr className="w-full mb-10" />
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-y-5">
            <div className="flex flex-col md:flex-row w-full gap-x-2">
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className=" w-full md:w-1/2 xl:1/2">
                    <FormLabel className="font-semibold">Last Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Last Names"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="firstNames"
                render={({ field }) => (
                  <FormItem className=" w-full md:w-1/2 xl:1/2">
                    <FormLabel className="font-semibold">First Names</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="First Names"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex md:flex-row flex-col w-full gap-x-2">
              <FormField
                control={form.control}
                name="ffhMemberNo"
                render={({ field }) => (
                  <FormItem className=" w-full md:w-1/2 xl:w-1/2">
                    <FormLabel className="font-semibold">
                      FFH Member No.
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Member No." {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="idNumber"
                render={({ field }) => (
                  <FormItem className=" w-full md:w-1/2 xl:w-1/2">
                    <FormLabel className="font-semibold">ID Number</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="ID Number"
                        {...field}
                        type="number"
                        minLength={13}
                        maxLength={13}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="dateOfDeath"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of Death:*</FormLabel>
                  <div className="relative">
                    <NextDatePicker
                      onChange={field.onChange}
                      value={field.value}
                      minDate={new Date('18 May 1900')}
                      maxDate={new Date()}
                    />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="removalDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of Removal:*</FormLabel>
                  <div className="relative">
                    <NextDatePicker
                      onChange={field.onChange}
                      value={field.value}
                      minDate={form.getValues().dateOfDeath}
                      maxDate={new Date()}
                    />
                  </div>
                </FormItem>
              )}
            />
          </div>

          <h2 className="text-lg font-semibold mt-5">
            Removal Address Details:
          </h2>
          <hr className="w-full my-2" />

          <div className="flex flex-wrap gap-x-2 gap-y-2">
            <FormField
              control={form.control}
              name="removalFrom.street"
              render={({ field }) => (
                <FormItem className=" flex-1 md:w-1/2 xl:flex-auto">
                  <FormLabel className="font-semibold">Street Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Street name"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="removalFrom.city"
              render={({ field }) => (
                <FormItem className=" w-full md:w-1/2 xl:flex-shrink">
                  <FormLabel className="font-semibold">City</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="City" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="deathCertificateRecipient"
            render={({ field }) => (
              <FormItem className=" flex-1 md:w-1/2 xl:flex-auto">
                <FormLabel className="font-semibold">
                  Death Certificate Recipient
                </FormLabel>
                <FormControl>
                  <Input disabled={loading} placeholder="John" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="pt-6 space-x-2 flex items-center justify-end w-full">
            <Button variant={'default'} type="submit">
              Confirm
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
};

export default AddDeceasedModal;
