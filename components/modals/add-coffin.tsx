import React, { useEffect, useState } from 'react';
import { Modal } from '../ui/modal';
import * as z from 'zod';
import useSWR, { SWRConfiguration } from 'swr';
import { Coffin } from '@prisma/client';
import { useCoffinModal } from '@/hooks/use-deceased-modal';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

const formSchema = z.object({
  coffinName: z.string().min(1),
  price: z.coerce.number(),
});

type AddCoffinFormValues = z.infer<typeof formSchema>;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const AddCoffinModal = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  const addCoffinModal = useCoffinModal();
  const searchParams = useSearchParams();
  const { user, isLoading: userLoading, error: userError } = useUser();
  const router = useRouter();

  const coffinId = searchParams.get('coffinId');

  const config: SWRConfiguration = {
    revalidateOnFocus: true,
  };

  const form = useForm<AddCoffinFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      coffinName: '',
      price: 0,
    },
  });

  const onClose = () => {
    form.reset();

    addCoffinModal.onClose();
    if (coffinId) {
      router.back();
    }
  };

  const {
    data,
    error,
    isLoading,
  }: { data: Coffin; error: any; isLoading: any } = useSWR(
    coffinId ? `/api/coffin/${coffinId}` : null,
    fetcher,
    {
      refreshInterval: 800,
    }
  );

  const onSubmit = async (data: AddCoffinFormValues) => {
    setLoading(true);

    try {
      if (coffinId) {
        await axios.patch(`/api/coffin/${coffinId}`, data);
      } else {
        await axios.post(`/api/coffin`, data);
      }

      addCoffinModal.onClose();

      toast.success(toastMessage);

      router.push('/admin#coffins');
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong. Try again!');
    } finally {
      setLoading(false);
    }
  };

  const { control, handleSubmit, register, formState, watch, setValue } = form;

  const toastMessage = coffinId
    ? 'Coffin Update Successfully'
    : 'Coffin Added Successfully';

  const heading = coffinId ? 'Update Coffin Details:' : 'Add New coffin';

  const subtitle = coffinId
    ? 'Update details for existing coffin'
    : 'Make new coffin available';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (data) {
      setValue('coffinName', data.coffinName);
      setValue('price', data.price);
    }
  }, [coffinId]);

  if (!isMounted) {
    return null;
  }

  if (isLoading && !error) {
    return (
      <Modal
        title={`Loading`}
        description=""
        isOpen={addCoffinModal.isOpen}
        onClose={addCoffinModal.onClose}
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
      isOpen={addCoffinModal.isOpen}
      onClose={onClose}
    >
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-y-3"
        >
          <FormField
            control={form.control}
            name="coffinName"
            render={({ field }) => (
              <FormItem className=" w-full md:w-1/2 xl:w-1/2">
                <FormLabel className="font-semibold">Name Of Coffin</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Presidential" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className=" w-full md:w-1/2 xl:w-1/2">
                <FormLabel className="font-semibold">Price of Coffin</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 4500" {...field} type="number" />
                </FormControl>
              </FormItem>
            )}
          />

          <Button variant="default" type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </Modal>
  );
};

export default AddCoffinModal;
