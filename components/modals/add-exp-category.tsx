import React, { useEffect, useState } from 'react';
import { Modal } from '../ui/modal';
import * as z from 'zod';
import useSWR, { SWRConfiguration } from 'swr';
import { Coffin } from '@prisma/client';
import { useExpCategoryModal } from '@/hooks/use-deceased-modal';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { CrossSizes, ExpCategory } from '@/types';

const formSchema = z.object({
  name: z.string().min(1),
});

type AddExpCategoryFormValues = z.infer<typeof formSchema>;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const AddExpCategoryModal = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  const expCategoryModal = useExpCategoryModal();
  const searchParams = useSearchParams();
  const { user, isLoading: userLoading, error: userError } = useUser();
  const router = useRouter();

  const expCatId = searchParams.get('expCatId');

  const config: SWRConfiguration = {
    revalidateOnFocus: true,
  };

  const form = useForm<AddExpCategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  const onClose = () => {
    form.reset();

    expCategoryModal.onClose();
    if (expCatId) {
      router.back();
    }
  };

  const {
    data,
    error,
    isLoading,
  }: { data: ExpCategory[]; error: any; isLoading: any } = useSWR(
    expCatId ? `/api/category` : null,
    fetcher,
    {
      refreshInterval: 800,
    }
  );

  const onSubmit = async (data: AddExpCategoryFormValues) => {
    setLoading(true);

    try {
      if (expCatId) {
        await axios.patch(`/api/category/${expCatId}`, data);
      } else {
        await axios.post(`/api/category`, data);
      }

      expCategoryModal.onClose();
      form.reset();

      toast.success(toastMessage);

      router.push('/admin#expenses');
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong. Try again!');
    } finally {
      setLoading(false);
    }
  };

  const { control, handleSubmit, register, formState, watch, setValue } = form;

  const toastMessage = expCatId
    ? 'Category Update Successfully'
    : 'Category Added Successfully';

  const heading = expCatId
    ? 'Update Expense Category Details:'
    : 'Add New Category';

  const subtitle = expCatId
    ? 'Update details for existing category'
    : 'Make new Expense Category available';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (data) {
      const category = data.find((cat) => cat.id == expCatId);

      if (category) {
        setValue('name', category.name);
      }
    }
  }, [expCatId]);

  if (!isMounted) {
    return null;
  }

  if (isLoading && !error) {
    return (
      <Modal
        title={`Loading`}
        description=""
        isOpen={expCategoryModal.isOpen}
        onClose={expCategoryModal.onClose}
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
      isOpen={expCategoryModal.isOpen}
      onClose={onClose}
    >
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-y-3"
        >
          <FormField
            control={form.control}
            name="name"
            disabled={isLoading}
            render={({ field }) => (
              <FormItem className=" w-full md:w-1/2 xl:w-1/2">
                <FormLabel className="font-semibold">
                  Expense Category Name
                </FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Small" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <Button variant="default" type="submit" disabled={isLoading}>
            Submit
          </Button>
        </form>
      </Form>
    </Modal>
  );
};

export default AddExpCategoryModal;
