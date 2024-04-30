import React, { useEffect, useState } from 'react';
import { Modal } from '../ui/modal';
import * as z from 'zod';
import useSWR, { SWRConfiguration } from 'swr';
import { Coffin } from '@prisma/client';
import {
  useAddOnModal,
  useCoffinModal,
  useGraveModal,
} from '@/hooks/use-deceased-modal';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { AddOn, Grave } from '@/types';

const formSchema = z.object({
  addOnName: z.string().min(1),
  price: z.coerce.number(),
});

type AddAddOnFormValues = z.infer<typeof formSchema>;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const AddOnModal = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  const modal = useAddOnModal();
  const searchParams = useSearchParams();
  const { user, isLoading: userLoading, error: userError } = useUser();
  const router = useRouter();

  const addOnId = searchParams.get('addOnId');

  const config: SWRConfiguration = {
    revalidateOnFocus: true,
  };

  const form = useForm<AddAddOnFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      addOnName: '',
      price: 0,
    },
  });

  const onClose = () => {
    form.reset();

    modal.onClose();

    if (addOnId) {
      router.back();
    }
  };

  const {
    data,
    error,
    isLoading,
  }: { data: AddOn; error: any; isLoading: any } = useSWR(
    addOnId ? `/api/addOn/${addOnId}` : null,
    fetcher,
    {
      refreshInterval: 800,
    }
  );

  const onSubmit = async (data: AddAddOnFormValues) => {
    setLoading(true);

    try {
      if (addOnId) {
        await axios.patch(`/api/addOn/${addOnId}`, data);
      } else {
        await axios.post(`/api/addOn`, data);
      }

      modal.onClose();

      toast.success(toastMessage);
      form.reset();

      router.push('/admin#addOns');
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong. Try again!');
    } finally {
      setLoading(false);
    }
  };

  const { control, handleSubmit, register, formState, watch, setValue } = form;

  const toastMessage = addOnId
    ? 'Funeral Arrangement Add-On Updated Successfully'
    : 'Funeral Arrangement Add-On Created Successfully';

  const heading = addOnId
    ? 'Update Funeral Arrangement  Add-On Details:'
    : 'Create new Funeral Arrangement Add-On';

  const subtitle = addOnId
    ? 'Update details for existing Funeral Arrangement  Add-On'
    : 'Create new Add-on to be made available during Funeral Arrangement set up';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!addOnId) form.reset();
  }, [addOnId]);

  useEffect(() => {
    if (data) {
      setValue('addOnName', data.name);
      setValue('price', data.price);
    }
  }, [addOnId, data]);

  if (!isMounted) {
    return null;
  }

  if (isLoading && !error) {
    return (
      <Modal
        title={`Loading`}
        description=""
        isOpen={modal.isOpen}
        onClose={modal.onClose}
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
      isOpen={modal.isOpen}
      onClose={onClose}
    >
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-y-3"
        >
          <FormField
            control={form.control}
            name="addOnName"
            render={({ field }) => (
              <FormItem className=" w-full md:w-1/2 xl:w-1/2">
                <FormLabel className="font-semibold">Name of Add-on</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Wreaths" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
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

export default AddOnModal;
