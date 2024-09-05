'use client';

import React, { useEffect, useState } from 'react';
import * as z from 'zod';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import axios, { AxiosResponse } from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { useUser } from '@auth0/nextjs-auth0/client';
import useSWR, { SWRConfiguration } from 'swr';
import { useDeceasedModal } from '@/hooks/use-deceased-modal';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import NextDatePicker from '@/components/ui/custom-datepicker';
import { Button } from '@/components/ui/button';
import { Deceased } from '@prisma/client';

interface Props {
  deceasedDetails: Deceased | null;
}

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
  removalTime: z.string(),
  deathCertificateRecipient: z.string().min(1),

  createdBy: z.string(),
  updatedBy: z.string(),
});

const getDateOfBirth = (idNumber: string) => {
  const getYear = idNumber.substring(0, 2);
  const getMonth = idNumber.substring(2, 4);
  const getDate = idNumber.substring(4, 6);

  const dateOfBirth = new Date();

  const currentYear = new Date().getFullYear().toString().substring(2, 4);

  if (Number(getYear) <= Number(currentYear)) {
    dateOfBirth.setFullYear(Number(getYear) + 2000);
  } else {
    dateOfBirth.setFullYear(Number(getYear) + 1900);
  }

  dateOfBirth.setMonth(Number(getMonth) - 1);

  dateOfBirth.setDate(Number(getDate));

  return dateOfBirth;
};

type DeceasedFormValues = z.infer<typeof formSchema>;

const DeceasedForm = ({ deceasedDetails }: Props) => {
  const deceasedModal = useDeceasedModal();
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { user, isLoading: userLoading, error } = useUser();
  const router = useRouter();

  const form = useForm<DeceasedFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: deceasedDetails
      ? {
          ...deceasedDetails,
          removalTime: deceasedDetails.removalTime
            ? deceasedDetails?.removalTime
            : '',
          updatedBy: deceasedDetails.updatedBy ? deceasedDetails.updatedBy : '',
        }
      : {
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
          removalTime: '',
          deathCertificateRecipient: '',
          createdBy: 'email',
          updatedBy: '',
        },
  });

  const onSubmit = async (data: DeceasedFormValues) => {
    let message;
    let result;

    setLoading(true);

    try {
      if (deceasedDetails) {
        if (!error || !userLoading) {
          if (user?.name) {
            data.updatedBy = user.name;
          }
        }
        result = await axios.patch(`/api/deceased/${deceasedDetails.id}`, data);

        message = result.statusText;
      } else {
        if (!error || !userLoading) {
          if (user?.name) {
            data.createdBy = user.name;
          }
        }
        result = await axios.post('/api/deceased', data);
        message = result.statusText;
      }

      if (result.status != 200) {
        toast.error(message);
      }

      toast.success('Deceased Details added!');
      form.reset();

      router.push(`/deceased`);
      router.refresh();
    } catch (error: any) {
      toast.error(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  const { control, handleSubmit, register, formState, watch, setValue } = form;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  //Auto fill date of birth based on ID Number
  useEffect(() => {
    if (form.getValues().idNumber) {
      const dateOfBirth = getDateOfBirth(form.getValues().idNumber);

      form.setValue('dateOfBirth', dateOfBirth);
    }
  }, [form.getValues().idNumber]);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <hr className="w-full my-2" />

      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col w-full"
        >
          <div className="w-full flex-row gap-x-5 flex">
            <section className="w-1/2 flex flex-col">
              <h2 className="text-lg font-semibold w-full text-center p-2 bg-blue-200">
                Deceased Person Details
              </h2>
              <hr className="w-full mb-5 mt-2" />
              <div className="flex flex-col gap-y-5">
                <div className="flex flex-col md:flex-row w-full gap-x-2">
                  <FormField
                    control={form.control}
                    name="lastName"
                    disabled={isLoading}
                    render={({ field }) => (
                      <FormItem
                        className={`${
                          isLoading && 'animate-pulse'
                        } w-full md:w-1/2 xl:1/2`}
                      >
                        <FormLabel className="font-semibold">
                          Last Name
                        </FormLabel>
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
                    disabled={isLoading}
                    render={({ field }) => (
                      <FormItem
                        className={`${
                          isLoading && 'animate-pulse'
                        } w-full md:w-1/2 xl:1/2`}
                      >
                        <FormLabel className="font-semibold">
                          First Names
                        </FormLabel>
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
                    disabled={isLoading}
                    render={({ field }) => (
                      <FormItem
                        className={`${
                          isLoading && 'animate-pulse'
                        } w-full md:w-1/2 xl:1/2`}
                      >
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
                    disabled={isLoading}
                    render={({ field }) => (
                      <FormItem
                        className={`${
                          isLoading && 'animate-pulse'
                        } w-full md:w-1/2 xl:1/2`}
                      >
                        <FormLabel className="font-semibold">
                          ID Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder="ID Number"
                            {...field}
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
                  disabled={isLoading}
                  render={({ field }) => (
                    <FormItem
                      className={`${
                        isLoading && 'animate-pulse'
                      } "flex flex-col"`}
                    >
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
                  name="dateOfBirth"
                  disabled={isLoading}
                  render={({ field }) => (
                    <FormItem
                      className={`${
                        isLoading && 'animate-pulse'
                      } "flex flex-col"`}
                    >
                      <FormLabel>Date of Birth:*</FormLabel>
                      <div className="relative">
                        <NextDatePicker
                          onChange={field.onChange}
                          value={field.value}
                          minDate={new Date('18 May 1800')}
                          maxDate={new Date()}
                        />
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </section>

            <section className="flex flex-col w-1/2 gap-y-2">
              <h2 className="text-lg font-semibold w-full text-center p-2 bg-blue-200">
                Removal Address Details
              </h2>
              <hr className="w-full  -mt-2 my-2" />
              <FormField
                control={form.control}
                name="removalDate"
                disabled={isLoading}
                render={({ field }) => (
                  <FormItem
                    className={`${
                      isLoading && 'animate-pulse'
                    } "flex flex-col"`}
                  >
                    <FormLabel>Date of Removal:*</FormLabel>
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

              <div className="flex flex-wrap gap-x-2 gap-y-2">
                <FormField
                  control={form.control}
                  name="removalFrom.street"
                  disabled={isLoading}
                  render={({ field }) => (
                    <FormItem
                      className={`${
                        isLoading && 'animate-pulse'
                      } flex-1 md:w-1/2 xl:flex-auto`}
                    >
                      <FormLabel className="font-semibold">
                        Place of Removal
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Livingstone Hospital"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="removalFrom.city"
                  disabled={isLoading}
                  render={({ field }) => (
                    <FormItem
                      className={`${
                        isLoading && 'animate-pulse'
                      } w-full md:w-1/2 xl:flex-shrink`}
                    >
                      <FormLabel className="font-semibold">City</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="City"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="removalTime"
                  disabled={isLoading}
                  render={({ field }) => (
                    <FormItem
                      className={`${
                        isLoading && 'animate-pulse'
                      } w-full md:w-1/2 xl:flex-shrink`}
                    >
                      <FormLabel className="font-semibold">
                        Removal Time
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="11am"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="deathCertificateRecipient"
                disabled={isLoading}
                render={({ field }) => (
                  <FormItem
                    className={`${
                      isLoading && 'animate-pulse'
                    } flex-1 md:w-1/2 xl:flex-auto`}
                  >
                    <FormLabel className="font-semibold">
                      Death Certificate Recipient
                    </FormLabel>
                    <FormControl>
                      <Input disabled={loading} placeholder="John" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </section>
          </div>
          <div className="pt-6 space-x-2 flex items-center justify-end w-full">
            <Button variant={'default'} type="submit" disabled={isLoading}>
              Confirm
            </Button>
          </div>
          <hr className="w-full my-7" />
        </form>
      </Form>
    </>
  );
};

export default DeceasedForm;
