import React, { useEffect, useState } from 'react';
import { Modal } from '../ui/modal';
import * as z from 'zod';
import useSWR, { SWRConfiguration } from 'swr';
import { useTombstoneModal } from '@/hooks/use-deceased-modal';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Tombstone } from '@/types';

const formSchema = z.object({
  type: z.string().min(1),
  tombstoneName: z.string().min(1),
  price: z.coerce.number(),
});

type AddTombstoneFormValues = z.infer<typeof formSchema>;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const AddTombstoneModal = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  const addTombstoneModal = useTombstoneModal();
  const searchParams = useSearchParams();
  const { user, isLoading: userLoading, error: userError } = useUser();
  const router = useRouter();

  const tombstoneId = searchParams.get('tombstoneId');

  const config: SWRConfiguration = {
    revalidateOnFocus: true,
  };

  const form = useForm<AddTombstoneFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: '',
      tombstoneName: '',
      price: 0,
    },
  });

  const onClose = () => {
    addTombstoneModal.onClose();
    form.reset();
    if (tombstoneId) {
      router.back();
    }
  };

  const {
    data,
    error,
    isLoading,
  }: { data: Tombstone; error: any; isLoading: any } = useSWR(
    tombstoneId ? `/api/tombstone/${tombstoneId}` : null,
    fetcher,
    {
      refreshInterval: 800,
    }
  );

  const onSubmit = async (data: AddTombstoneFormValues) => {
    setLoading(true);

    try {
      if (tombstoneId) {
        await axios.patch(`/api/tombstone/${tombstoneId}`, data);
      } else {
        await axios.post(`/api/tombstone`, data);
      }

      addTombstoneModal.onClose();

      toast.success(toastMessage);

      router.push('/admin#tombstones');
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong. Try again!');
    } finally {
      setLoading(false);
    }
  };

  const { control, handleSubmit, register, formState, watch, setValue } = form;

  const toastMessage = tombstoneId
    ? 'Tombstone Update Successfully'
    : 'Tombstone Added Successfully';

  const heading = tombstoneId
    ? 'Update Tombstone Details:'
    : 'Add New Tombstone site';

  const subtitle = tombstoneId
    ? 'Update details for existing Tombstone details'
    : 'Make new Tombstone available';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (data) {
      setValue('type', data.type);
      setValue('tombstoneName', data.tombstoneName);
      setValue('price', data.price);
    }
  }, [tombstoneId, data]);

  if (!isMounted) {
    return null;
  }

  if (isLoading && !error) {
    return (
      <Modal
        title={`Loading`}
        description=""
        isOpen={addTombstoneModal.isOpen}
        onClose={addTombstoneModal.onClose}
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
      isOpen={addTombstoneModal.isOpen}
      onClose={onClose}
    >
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-y-3"
        >
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className=" w-full md:w-1/2 xl:w-1/2">
                <FormLabel className="font-semibold">Tombstone Type</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Granite" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tombstoneName"
            render={({ field }) => (
              <FormItem className=" w-full md:w-1/2 xl:w-1/2">
                <FormLabel className="font-semibold">
                  Name of Tombstone
                </FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Flat Top" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className=" w-full md:w-1/2 xl:w-1/2">
                <FormLabel className="font-semibold">
                  Price of Tombstone
                </FormLabel>
                <Input placeholder="e.g. 4500" {...field} type="number" />
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

export default AddTombstoneModal;
