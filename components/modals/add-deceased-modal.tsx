'use client';

import React, { useEffect, useState } from 'react';
import * as z from 'zod';

import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';
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

interface DeceasedModalProps {
  data?: Deceased;
}

const formSchema = z.object({
  ffhMemberNo: z.string(),
  lastName: z.string().min(1),
  firstNames: z.string().min(1),
  idNumber: z.string().min(1),
  dateOfDeath: z.date({ required_error: 'Date of Death is required' }),
  dateOfBirth: z.date({ required_error: 'Date of Birth is required' }),

  removalDate: z.date({ required_error: 'Date of removal is required' }),
  removalFrom: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    province: z.string().min(1),
    zip: z.string().min(1),
  }),
  deathCertificateRecipient: z.string().min(1),

  createdBy: z.string(),
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
    revalidateOnFocus: true,
    revalidateIfStale: true,
  };

  const {
    data: deceased,
    error: dataError,
    isLoading,
  }: { data: Deceased; error: any; isLoading: any } = useSWR(
    `/api/deceased/${id}`,
    fetcher,
    config
  );

  const form = useForm<DeceasedFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: deceased
      ? {
          dateOfDeath: deceased?.dateOfDeath,
          dateOfBirth: deceased?.dateOfBirth,

          ffhMemberNo: deceased?.ffhMemberNo,
          lastName: deceased?.lastName,
          firstNames: deceased?.firstNames,
          idNumber: deceased?.idNumber,
          removalDate: deceased?.removalDate,
          removalFrom: {
            street: deceased?.removalFrom?.street,
            city: deceased?.removalFrom?.city,
            province: deceased?.removalFrom?.province,
            zip: deceased?.removalFrom?.zip,
          },
          deathCertificateRecipient: deceased?.deathCertificateRecipient,
          createdBy: deceased?.createdBy,
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
            province: '',
            zip: '',
          },
          deathCertificateRecipient: '',
          createdBy: 'email',
        },
  });

  const onSubmit = async (data: DeceasedFormValues) => {
    setLoading(true);

    try {
      if (!error || !userLoading) {
        if (user?.email) {
          data.createdBy = user.email;
        }
      }

      if (deceased) {
        await axios.patch(`/api/deceased/${deceased.id}`, data);
      } else {
        await axios.post('/api/deceased', data);
      }

      deceasedModal.onClose();
      router.push(`/deceased`);
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const onClose = () => {
    deceasedModal.onClose();
    router.push('/deceased');
  };

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    watch,
    setValue,
  } = form;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  if (isLoading) {
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

  if (deceased) {
    setValue('firstNames', deceased.firstNames);
    setValue('lastName', deceased.lastName);
    setValue('dateOfBirth', deceased.dateOfBirth);
    setValue('dateOfDeath', deceased.dateOfDeath);
    setValue('deathCertificateRecipient', deceased.deathCertificateRecipient);
    setValue('ffhMemberNo', deceased.ffhMemberNo);
    setValue('idNumber', deceased.idNumber);
    setValue('removalFrom.city', deceased.removalFrom.city);
    setValue('removalFrom.zip', deceased.removalFrom.zip);
    setValue('removalFrom.street', deceased.removalFrom.street);
    setValue('removalFrom.province', deceased.removalFrom.province);
    setValue('removalDate', deceased.removalDate);
  }

  return (
    <Modal
      title="Add Deceased Details"
      description="Upload deceased details"
      isOpen={deceasedModal.isOpen}
      onClose={onClose}
    >
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-y-5">
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of Birth:*</FormLabel>
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
                            format(new Date(field.value), 'PPP')
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
              name="dateOfDeath"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of Death:*</FormLabel>
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
                            format(new Date(field.value), 'PPP')
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
                        minLength={13}
                        maxLength={13}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col md:flex-row w-full gap-x-2">
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
            <FormField
              control={form.control}
              name="removalDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of Removal:*</FormLabel>
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
                            format(new Date(field.value), 'PPP')
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
            <FormField
              control={form.control}
              name="removalFrom.province"
              render={({ field }) => (
                <FormItem className=" w-full md:flex-shrink xl:flex-1">
                  <FormLabel className="font-semibold">Province</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Province"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="removalFrom.zip"
              render={({ field }) => (
                <FormItem className=" w-full md:w-1/4 xl:flex-1">
                  <FormLabel className="font-semibold">Zip</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Zip" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
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
