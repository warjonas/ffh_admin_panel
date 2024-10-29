'use client';

import { Button } from '@/components/ui/button';
import NextDatePicker from '@/components/ui/custom-datepicker';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn, formatter } from '@/lib/utils';
import { useUser } from '@auth0/nextjs-auth0/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Invoice } from '@prisma/client';
import axios from 'axios';
import { Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';

interface Props {
  initialData: Invoice | null;
  params: { invoiceId: string };
}

const formSchema = z.object({
  dueDate: z.date(),
  paymentReference: z.string().min(1),
  customerDetails: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    phoneNo: z.string().min(10),
    email: z.string().email(),
    address: z.object({
      street: z.string().min(1),
      city: z.string().min(1),
    }),
  }),
  invoiceItems: z
    .object({
      description: z.string().min(1),
      qty: z.coerce.number(),
      unitPrice: z.coerce.number(),
      totalPrice: z.coerce.number(),
    })
    .array(),
  total: z.coerce.number(),
  discount: z.coerce.number(),
  createdBy: z.string(),
});

type InvoiceFormValues = z.infer<typeof formSchema>;

const InvoiceForm = ({ initialData, params }: Props) => {
  const { user, error, isLoading } = useUser();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          invoiceItems: initialData.invoiceItems
            ? initialData.invoiceItems
            : [{ description: '', qty: 0, totalPrice: 0, unitPrice: 0 }],
          customerDetails: initialData.customerDetails
            ? initialData.customerDetails
            : {
                address: {
                  city: '',
                  street: '',
                },
                email: '',
                firstName: '',
                lastName: '',
                phoneNo: '',
              },
        }
      : {
          customerDetails: {
            address: {
              street: '',
              city: '',
            },
            email: '',
            firstName: '',
            lastName: ' ',
            phoneNo: '',
          },
          dueDate: new Date(),
          invoiceItems: [
            {
              description: '',
              qty: 0,
              totalPrice: 0,
              unitPrice: 0,
            },
          ],
          paymentReference: '',
          total: 0,
          discount: 0,
          createdBy: user?.email ? user.email : '',
        },
  });

  const { control, handleSubmit, register, watch, setValue, getValues } = form;

  const { fields, append, prepend, remove, swap, move, insert, replace } =
    useFieldArray({
      control,
      name: 'invoiceItems',
    });

  const items = watch(['invoiceItems']);
  const discount = getValues().discount;
  const watchDiscount = watch(['discount']);
  //Calculates the total for items on the invoice
  useEffect(() => {
    const itemsAmount = fields.reduce((total, item) => {
      return total + Number(item.qty * item.unitPrice);
    }, 0);

    setTotal(itemsAmount - discount);
  }, [watchDiscount, discount, items, fields]);

  const onSubmit = async (data: InvoiceFormValues) => {
    if (user?.email) {
      data.createdBy = user.email;
    }
    data.total = total;

    data.invoiceItems.map((item) => {
      item.totalPrice = item.qty * item.unitPrice;
    });

    try {
      setLoading(true);

      if (initialData) {
        await axios.patch(`/api/invoice/${initialData.invoiceNo}`, data);
      } else {
        await axios.post(`/api/invoice`, data);
      }

      router.push('/invoices');
      toast.success('Invoice created successfully!');
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full h-full flex flex-col my-5"
        >
          <section className="h-full w-full xl:w-1/2 flex flex-row gap-y-5 gap-x-8">
            <div className="flex flex-col w-1/2 gap-y-2">
              <h1 className="text-xl font-bold mb-4">Customer Details</h1>
              <div className="flex flex-row gap-x-5 w-full">
                <FormField
                  control={form.control}
                  name="customerDetails.firstName"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-1/2">
                      <FormLabel className="mb-1">First Name*</FormLabel>
                      <div className="relative">
                        <Input
                          disabled={loading}
                          placeholder="John"
                          {...field}
                        />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customerDetails.lastName"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-1/2">
                      <FormLabel className="mb-1">Last Name*</FormLabel>
                      <div className="relative">
                        <Input
                          disabled={loading}
                          placeholder="Doe"
                          {...field}
                        />
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="customerDetails.phoneNo"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-1/2">
                    <FormLabel className="mb-1">Phone No.*</FormLabel>
                    <div className="relative">
                      <Input
                        disabled={loading}
                        placeholder="0847987451"
                        {...field}
                      />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customerDetails.email"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-1/2">
                    <FormLabel className="mb-1">Email*</FormLabel>
                    <div className="relative">
                      <Input
                        disabled={loading}
                        placeholder="johndoe@gmail.com"
                        {...field}
                      />
                    </div>
                  </FormItem>
                )}
              />
              <div className="w-full flex gap-x-5">
                <FormField
                  control={form.control}
                  name="customerDetails.address.street"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-1/2">
                      <FormLabel className="mb-1">Street*</FormLabel>
                      <div className="relative">
                        <Input
                          disabled={loading}
                          placeholder="14 Augustus Street"
                          {...field}
                        />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customerDetails.address.city"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-1/2">
                      <FormLabel className="mb-1">City*</FormLabel>
                      <div className="relative">
                        <Input disabled={loading} placeholder="GQ" {...field} />
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="w-1/2 pl-20 flex flex-col items-start gap-y-2">
              <h1 className="text-xl font-bold mb-4">Invoice Details</h1>
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date:*</FormLabel>
                    <div className="relative">
                      <NextDatePicker
                        onChange={field.onChange}
                        value={field.value}
                        minDate={new Date()}
                      />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paymentReference"
                render={({ field }) => (
                  <FormItem className=" w-1/2">
                    <FormLabel className="font-semibold">
                      Payment Reference
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Reference No."
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </section>

          <section className="flex flex-col w-full xl:w-1/2 mt-10">
            <div className="w-full grid grid-cols-6 mb-2 py-3 border-b border-t">
              <h1 className="col-start-1 col-span-2">Description</h1>
              <h1 className="col-start-3">Unit Price</h1>
              <h1 className="col-start-4">Qty</h1>
              <h1 className="col-start-5">Total</h1>
              <Plus
                className="justify-self-end col-start-6  h-6 w-6"
                onClick={() =>
                  append({
                    description: '',
                    qty: 0,
                    unitPrice: 0,
                    totalPrice: 0,
                  })
                }
              />
            </div>

            <div className="w-full grid grid-cols-6 gap-x-3 gap-y-2">
              {fields.map((field, index) => (
                <>
                  <FormItem className={cn(' w-full  col-start-1 col-span-2')}>
                    <FormControl>
                      <Input
                        key={field.id} // important to include key with field's id
                        {...register(`invoiceItems.${index}.description`)}
                        placeholder="Description"
                      />
                    </FormControl>
                  </FormItem>
                  <FormItem className={cn('w-full  col-start-3')}>
                    <FormControl>
                      <Input
                        key={field.id} // important to include key with field's id
                        {...register(`invoiceItems.${index}.unitPrice`)}
                        placeholder="Unit Price"
                      />
                    </FormControl>
                  </FormItem>
                  <FormItem className={cn('w-full  col-start-4')}>
                    <FormControl>
                      <Input
                        key={field.id} // important to include key with field's id
                        {...register(`invoiceItems.${index}.qty`)}
                        placeholder="qty"
                      />
                    </FormControl>
                  </FormItem>
                  <FormItem className={cn('w-full  col-start-5')}>
                    <FormControl>
                      <Input
                        key={field.id} // important to include key with field's id
                        {...register(`invoiceItems.${index}.totalPrice`)}
                        placeholder="total"
                        disabled
                        value={field.qty * field.unitPrice}
                      />
                    </FormControl>
                  </FormItem>
                  <X
                    className="h-6 w-6 col-start-6 justify-self-end self-center text-background rounded-full shadow-sm col-auto bg-red-800"
                    onClick={() => remove(index)}
                  />
                </>
              ))}
            </div>
          </section>
          <hr className="w-1/2 my-5" />
          <section className="flex flex-col w-full xl:w-1/2">
            <div className="w-1/4 grid grid-cols-2 justify-end self-end text-lg font-bold gap-y-3">
              <h1 className="col-start-1 text-right self-center">Discount: </h1>
              <div className="flex col-start-2 row-start-1 pl-5 gap-x-2 items-center">
                <h1>R</h1>
                <FormField
                  control={form.control}
                  name="discount"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="0"
                          {...field}
                          className="p-2 text-lg"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <h1 className="row-start-2 col-start-1 text-right">VAT: </h1>
              <h1 className="row-start-2 col-start-2 text-right">R 0.00 </h1>
              <h1 className="row-start-3 col-start-1 text-right">Total: </h1>
              <h1 className="row-start-3 col-start-2 text-right">
                {formatter.format(total)}{' '}
              </h1>
            </div>
          </section>
          <hr className="w-full xl:w-1/2 my-4" />
          <section className="w-full xl:w-1/2 flex justify-end">
            <Button
              type="submit"
              className="w-48 font-semibold"
              disabled={loading}
            >
              Submit
            </Button>
          </section>
        </form>
      </Form>
    </>
  );
};

export default InvoiceForm;
