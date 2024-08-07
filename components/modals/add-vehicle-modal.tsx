'use client';

import React, { useEffect, useState } from 'react';
import { Modal } from '../ui/modal';
import * as z from 'zod';
import useSWR, { SWRConfiguration } from 'swr';
import { Coffin } from '@prisma/client';
import { useCoffinModal, useVehicleModal } from '@/hooks/use-deceased-modal';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Vehicle } from '@/types';

const formSchema = z.object({
  registration: z.string().min(1),
  colour: z.string().min(1),
});

type AddVehicleFormValues = z.infer<typeof formSchema>;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const AddVehicleModal = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  const addVehicle = useVehicleModal();
  const searchParams = useSearchParams();
  const { user, isLoading: userLoading, error: userError } = useUser();
  const router = useRouter();

  const vehicleId = searchParams.get('vehicleId');

  const config: SWRConfiguration = {
    revalidateOnFocus: true,
  };

  const form = useForm<AddVehicleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      registration: '',
      colour: '',
    },
  });

  const onClose = () => {
    form.reset();

    addVehicle.onClose();
    if (vehicleId) {
      router.back();
    }
  };

  const {
    data,
    error,
    isLoading,
  }: { data: Vehicle; error: any; isLoading: any } = useSWR(
    vehicleId ? `/api/vehicle/${vehicleId}` : null,
    fetcher,
    {
      refreshInterval: 800,
    }
  );

  const onSubmit = async (data: AddVehicleFormValues) => {
    setLoading(true);

    try {
      if (vehicleId) {
        await axios.patch(`/api/vehicle/${vehicleId}`, data);
      } else {
        await axios.post(`/api/vehicle`, data);
      }

      addVehicle.onClose();

      toast.success(toastMessage);

      router.push('/admin#vehicles');
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong. Try again!');
    } finally {
      setLoading(false);
    }
  };

  const { control, handleSubmit, register, formState, watch, setValue } = form;

  const toastMessage = vehicleId
    ? 'Vehicle Update Successfully'
    : 'Vehicle Added Successfully';

  const heading = vehicleId ? 'Update Vehicle Details:' : 'Add New Vehicle';

  const subtitle = vehicleId
    ? 'Update details for existing Vehicle'
    : 'Make new Vehicle available';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (data) {
      setValue('registration', data.registration);
      setValue('colour', data.colour);
    }
  }, [vehicleId]);

  if (!isMounted) {
    return null;
  }

  if (isLoading && !error) {
    return (
      <Modal
        title={`Loading`}
        description=""
        isOpen={addVehicle.isOpen}
        onClose={addVehicle.onClose}
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
      isOpen={addVehicle.isOpen}
      onClose={onClose}
    >
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-y-3"
        >
          <FormField
            control={form.control}
            name="registration"
            render={({ field }) => (
              <FormItem className=" w-full md:w-1/2 xl:w-1/2">
                <FormLabel className="font-semibold">
                  Vehicle Registration
                </FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Presidential" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="colour"
            render={({ field }) => (
              <FormItem className=" w-full md:w-1/2 xl:w-1/2">
                <FormLabel className="font-semibold">Vehicle Colour</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Presidential" {...field} />
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

export default AddVehicleModal;
