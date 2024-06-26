'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import ImageUpload from '@/components/ui/image-upload';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { ExpCategory, SubExpCategory } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';

interface ExpenseFormProps {
  categories: ExpCategory[];
  subCategories: SubExpCategory[];
}

const formSchema = z.object({
  description: z.string().min(1),
  category: z.string().min(1),
  subCat: z.string().min(1),
  cost: z.coerce.number(),
  receiptUrl: z.string().min(1),
});

type ExpenseFormValues = z.infer<typeof formSchema>;

const ExpenseForm: React.FC<ExpenseFormProps> = ({
  categories,
  subCategories,
}) => {
  const filteredSubCatsRef = useRef<SubExpCategory[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [filteredSubCats, setfilteredSubCats] = useState<SubExpCategory[]>(
    filteredSubCatsRef.current
  );

  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onSubmit = async (data: ExpenseFormValues) => {
    setIsLoading(true);

    const response = await axios.post('/api/expense', data);

    if (response.status >= 400) {
      toast.error(response.data);
      setIsLoading(false);
    } else {
      router.back();

      toast.success('Expense added successfully');
      setIsLoading(false);
    }

    setIsLoading(false);
  };

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      category: '',
      subCat: '',
      cost: 0,
    },
  });

  const { control, handleSubmit, register, formState, watch, setValue } = form;

  const cat = watch('category');

  const subCat = watch('subCat');

  useEffect(() => {
    const filter = subCategories.filter((sub) => sub.expCategoryId == cat);

    setfilteredSubCats(filter);

    filteredSubCatsRef.current = filteredSubCats;
  }, [cat, subCategories]);

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-1/2 gap-y-3"
      >
        <FormField
          control={form.control}
          name="description"
          disabled={isLoading}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Expense Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the expense" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          disabled={isLoading}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select
                  disabled={isLoading}
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        defaultValue={field.value}
                        placeholder="Select Category"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem value={cat.id} key={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subCat"
          disabled={form.getValues().category == null || isLoading}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Sub-Category</FormLabel>
              <FormControl>
                <Select
                  disabled={form.getValues().category == null || isLoading}
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        defaultValue={field.value}
                        placeholder="Select Sub-Category"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {filteredSubCats.map((sub: SubExpCategory) => (
                      <SelectItem value={sub.id} key={sub.id}>
                        {sub.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cost"
          disabled={isLoading}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Cost (R)</FormLabel>
              <FormControl>
                <Input type="number" {...field} className="W-1/2" required />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="receiptUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">
                Proof of purchase (Receipt)
              </FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value ? [field.value] : []}
                  disabled={isLoading}
                  onChange={(url: string) => field.onChange(url)}
                  onRemove={() => field.onChange('')}
                  preset="qsoym9s1"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <section className="flex w-full gap-x-2 justify-end">
          <Button
            type="button"
            className="w-48 font-semibold bg-background text-primary border border-primary hover:bg-slate-100 "
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="w-48 font-semibold"
            disabled={isLoading}
          >
            Submit
          </Button>
        </section>
      </form>
    </Form>
  );
};

export default ExpenseForm;
