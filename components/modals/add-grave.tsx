import React, { useEffect, useState } from 'react';
import { Modal } from '../ui/modal';
import * as z from 'zod';
import useSWR, { SWRConfiguration } from 'swr';
import { Coffin } from '@prisma/client';
import { useCoffinModal, useGraveModal } from '@/hooks/use-deceased-modal';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Grave } from '@/types';

const formSchema = z.object({
  graveName: z.string().min(1),
  price: z.coerce.number(),
});

type AddGraveFormValues = z.infer<typeof formSchema>;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const AddGraveModal = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  const addGraveModal = useGraveModal();
  const searchParams = useSearchParams();
  const { user, isLoading: userLoading, error: userError } = useUser();
  const router = useRouter();

  const graveId = searchParams.get('graveId');

  const config: SWRConfiguration = {
    revalidateOnFocus: true,
  };

  const form = useForm<AddGraveFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      graveName: '',
      price: 0,
    },
  });

  const onClose = () => {
    form.reset();

    addGraveModal.onClose();

    if (graveId) {
      router.back();
    }
  };

  const {
    data,
    error,
    isLoading,
  }: { data: Grave; error: any; isLoading: any } = useSWR(
    graveId ? `/api/grave/${graveId}` : null,
    fetcher,
    {
      refreshInterval: 800,
    }
  );

  const onSubmit = async (data: AddGraveFormValues) => {
    setLoading(true);

    try {
      if (graveId) {
        await axios.patch(`/api/grave/${graveId}`, data);
      } else {
        await axios.post(`/api/grave`, data);
      }

      addGraveModal.onClose();

      toast.success(toastMessage);

      router.push('/admin#graves');
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong. Try again!');
    } finally {
      setLoading(false);
    }
  };

  const { control, handleSubmit, register, formState, watch, setValue } = form;

  const toastMessage = graveId
    ? 'Grave Update Successfully'
    : 'Grave Added Successfully';

  const heading = graveId ? 'Update Grave Details:' : 'Add New grave site';

  const subtitle = graveId
    ? 'Update details for existing grave site'
    : 'Make new grave site available';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (data) {
      setValue('graveName', data.graveName);
      setValue('price', data.price);
    }
  }, [graveId, data]);

  if (!isMounted) {
    return null;
  }

  if (isLoading && !error) {
    return (
      <Modal
        title={`Loading`}
        description=""
        isOpen={addGraveModal.isOpen}
        onClose={addGraveModal.onClose}
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
      isOpen={addGraveModal.isOpen}
      onClose={onClose}
    >
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-y-3"
        >
          <FormField
            control={form.control}
            name="graveName"
            render={({ field }) => (
              <FormItem className=" w-full md:w-1/2 xl:w-1/2">
                <FormLabel className="font-semibold">
                  Name of Grave Site
                </FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Cremation" {...field} />
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

export default AddGraveModal;
