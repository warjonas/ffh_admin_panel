import React, { useEffect, useState } from 'react';
import { Modal } from '../ui/modal';
import * as z from 'zod';
import useSWR, { SWRConfiguration } from 'swr';
import { Coffin } from '@prisma/client';
import {
  useAddSubCategoryModal,
  useExpCategoryModal,
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
import { CrossSizes, SubExpCategory } from '@/types';

const formSchema = z.object({
  name: z.string().min(1),
  expCatId: z.string().min(1),
});

type AddExpCategoryFormValues = z.infer<typeof formSchema>;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const AddSubCategoryModal = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  const addSubCategoryModal = useAddSubCategoryModal();
  const searchParams = useSearchParams();
  const router = useRouter();

  const expCatId = searchParams.get('expCatId');

  const subCatId = searchParams.get('subCatId');

  const form = useForm<AddExpCategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      expCatId: '',
    },
  });

  const onClose = () => {
    form.reset();

    addSubCategoryModal.onClose();
    if (subCatId) {
      router.back();
    }
  };

  const {
    data,
    error,
    isLoading,
  }: { data: SubExpCategory[]; error: any; isLoading: any } = useSWR(
    subCatId ? `/api/category/sub_category/` : null,
    fetcher,
    {
      revalidateOnFocus: true,
      refreshInterval: 800,
    }
  );

  const onSubmit = async (data: AddExpCategoryFormValues) => {
    setLoading(true);

    try {
      if (subCatId) {
        await axios.patch(`/api/category/sub_category/${subCatId}`, data);
      } else {
        await axios.post(`/api/category/sub_category`, data);
      }

      form.reset();
      addSubCategoryModal.onClose();
      toast.success(toastMessage);

      if (subCatId) router.back();
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong. Try again!');
    } finally {
      setLoading(false);
    }
  };

  const { control, handleSubmit, register, formState, watch, setValue } = form;

  const toastMessage = subCatId
    ? 'Sub-Category Update Successfully'
    : 'Sub-Category Added Successfully';

  const heading = subCatId
    ? 'Update Sub Category Details:'
    : 'Add Sub-Category';

  const subtitle = subCatId
    ? 'Update details for existing sub-category'
    : 'Create new Sub-Category available';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (data) {
      const subCat = data.find((sub) => sub.id == subCatId);

      if (subCat) setValue('name', subCat.name);
    }

    if (expCatId) form.setValue('expCatId', expCatId);
  }, [data, subCatId, expCatId]);

  if (!isMounted) {
    return null;
  }

  if (error) {
    return (
      <Modal
        title={`Loading`}
        description=""
        isOpen={addSubCategoryModal.isOpen}
        onClose={addSubCategoryModal.onClose}
      >
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            An error occurred. Please refresh the page.
          </span>
        </div>
      </Modal>
    );
  }
  return (
    <Modal
      title={heading}
      description={subtitle}
      isOpen={addSubCategoryModal.isOpen}
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
                  Sub Category Name
                </FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Fuel" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            variant="default"
            type="submit"
            disabled={loading || isLoading}
          >
            Submit
          </Button>
        </form>
      </Form>
    </Modal>
  );
};

export default AddSubCategoryModal;
