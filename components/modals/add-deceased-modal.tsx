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
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useUser } from '@auth0/nextjs-auth0/client';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  id?: string;
  loading: boolean;
}

const formSchema = z.object({
  ffhMemberNo: z.string(),
  lastName: z.string(),
  firstNames: z.string(),
  idNumber: z.string(),
  dateOfDeath: z.date({ required_error: 'Date of Death is required' }),
  removalDate: z.date({ required_error: 'Date of removal is required' }),
  removalFrom: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    province: z.string().min(1),
    zip: z.string().min(1),
  }),
  deathCertificateRecipient: z.string().min(1),
  dateOfFuneralService: z.date({
    required_error: 'Date of removal is required',
  }),

  createdBy: z.string(),
});

type DeceasedFormValues = z.infer<typeof formSchema>;

const AddDeceasedModal: React.FC<AlertModalProps> = ({
  isOpen,
  loading,
  onClose,
  id,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isLoading: userLoading, error } = useUser();
  const router = useRouter();

  const form = useForm<DeceasedFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dateOfDeath: new Date(),
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
      createdBy: '',
    },
  });

  const onSubmit = async (data: DeceasedFormValues) => {
    setIsLoading(true);

    try {
      if (!error || !userLoading) {
        if (user?.email) {
          data.createdBy = user.email;
        }
      }

      await axios.post('/api/deceased', data);
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong!');
    }

    router.push(`/deceased`);

    setIsLoading(false);
    onClose();
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = form;

  return (
    <Modal
      title="Add Deceased Details"
      description="Upload deceased details"
      isOpen={isOpen}
      onClose={onClose}
    >
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-y-5">
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
                      <Input
                        disabled={loading}
                        placeholder="Member No."
                        {...field}
                      />
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
        </form>
      </Form>
      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Button disabled={loading} variant={'outline'} onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={loading} variant={'default'} type="submit">
          Confirm
        </Button>
      </div>
    </Modal>
  );
};

export default AddDeceasedModal;
