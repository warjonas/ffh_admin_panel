'use client';

import React, { useEffect, useState } from 'react';
import { Modal } from '../ui/modal';
import * as z from 'zod';
import useSWR, { SWRConfiguration } from 'swr';
import { Coffin } from '@prisma/client';
import { useCoffinModal, useCrossModal } from '@/hooks/use-deceased-modal';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { CrossSize } from '@/types';

const formSchema = z.object({
  size: z.string().min(1),
  price: z.coerce.number(),
});

type AddCrossFormValues = z.infer<typeof formSchema>;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const AddCrossModal = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  const addCrossModal = useCrossModal();
  const searchParams = useSearchParams();
  const { user, isLoading: userLoading, error: userError } = useUser();
  const router = useRouter();

  const crossId = searchParams.get('crossId');

  const config: SWRConfiguration = {
    revalidateOnFocus: true,
  };

  const form = useForm<AddCrossFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      size: '',
      price: 0,
    },
  });

  const onClose = () => {
    form.reset();

    addCrossModal.onClose();
    if (crossId) {
      router.back();
    }
  };

  const {
    data,
    error,
    isLoading,
  }: { data: CrossSize; error: any; isLoading: any } = useSWR(
    crossId ? `/api/cross/${crossId}` : null,
    fetcher,
    {
      refreshInterval: 800,
    }
  );

  const onSubmit = async (data: AddCrossFormValues) => {
    setLoading(true);

    try {
      if (crossId) {
        await axios.patch(`/api/cross/${crossId}`, data);
      } else {
        await axios.post(`/api/cross`, data);
      }

      addCrossModal.onClose();

      toast.success(toastMessage);
      form.reset();

      router.push('/admin#cross');
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong. Try again!');
    } finally {
      setLoading(false);
    }
  };

  const { control, handleSubmit, register, formState, watch, setValue } = form;

  const toastMessage = crossId
    ? 'Cross Size Update Successfully'
    : 'Cross Size Added Successfully';

  const heading = crossId ? 'Update Cross Size Details:' : 'Add New Cross Size';

  const subtitle = crossId
    ? 'Update details for existing Cross Size'
    : 'Make new Cross Size available';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (data) {
      setValue('size', data.size);
      setValue('price', data.price);
    }
  }, [crossId]);

  if (!isMounted) {
    return null;
  }

  if (isLoading && !error) {
    return (
      <Modal
        title={`Loading`}
        description=""
        isOpen={addCrossModal.isOpen}
        onClose={addCrossModal.onClose}
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
      title={heading}
      description={subtitle}
      isOpen={addCrossModal.isOpen}
      onClose={onClose}
    >
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-y-3"
        >
          <FormField
            control={form.control}
            name="size"
            disabled={isLoading}
            render={({ field }) => (
              <FormItem className=" w-full md:w-1/2 xl:w-1/2">
                <FormLabel className="font-semibold">Cross Size</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Small" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            disabled={isLoading}
            render={({ field }) => (
              <FormItem className=" w-full md:w-1/2 xl:w-1/2">
                <FormLabel className="font-semibold">Price</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 4500" {...field} type="number" />
                </FormControl>
              </FormItem>
            )}
          />

          <Button variant="default" type="submit" disabled={loading}>
            Submit
          </Button>
        </form>
      </Form>
    </Modal>
  );
};

export default AddCrossModal;
