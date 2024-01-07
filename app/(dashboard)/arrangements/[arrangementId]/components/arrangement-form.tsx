'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import Heading from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Coffin, Tombstone } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, Plus, Trash } from 'lucide-react';
import React, { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';

import { revalidatePath } from 'next/cache';
import { Arrangement } from '@prisma/client';

interface ArrangementFormProps {
  initialData: Arrangement | null;
  tombstones: Tombstone[];
  coffins: Coffin[];
}

const formSchema = z.object({
  deceased: z.object({
    ffhMemberNo: z.string(),
    lastName: z.string(),
    firstNames: z.string(),
    idNumber: z.string(),
    dateOfDeath: z.date({ required_error: 'Date of Death is required' }),
    removalDate: z.date({ required_error: 'Date of removal is required' }),
    removalFrom: z.object({
      street: z.string().min(1),
      city: z.string().min(1),
      province: z.string().min(1),
      zip: z.string().min(1),
    }),
    deathCertificateRecipient: z.string().min(1),
    dateOfFuneralService: z.date({
      required_error: 'Date of removal is required',
    }),
  }),
  familyReps: z
    .object({
      firstName: z.string().min(1),
      lastName: z.string().min(1),
      relationship: z.string().min(1),
      phoneNo: z.string().min(1),
    })
    .array()
    .min(1),
  deliveryAddress: z.string().min(1),
  deliveryTime: z.string().min(1),
  church: z.object({
    churchName: z.string().min(1),
    Address: z.object({
      street: z.string().min(1),
      city: z.string().min(1),
      province: z.string().min(1),
      zip: z.string().min(1),
    }),
  }),
  minister: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    phoneNo: z.string().min(1),
  }),
  crossSize: z.string().min(3),
  cemetry: z.object({
    cemetryName: z.string().min(1),
    time: z.string().min(1),
  }),
  doves: z.boolean().default(false),
  liveStreaming: z.boolean().default(false),
  programs: z.coerce.number().min(50),
  bus: z.boolean().default(false),
  car: z.boolean().default(false),
  wreaths: z.boolean().default(false),

  storageDays: z.coerce.number().min(1),
  decor: z.object({
    candle: z.boolean().default(false),
    photo: z.boolean().default(false),
    glass: z.boolean().default(false),
    banner: z.boolean().default(false),
  }),
  tombstoneId: z.string().min(1),
  coffinid: z.string().min(1),
  totalPayable: z.coerce.number().default(10000),
  doctor: z.boolean().default(false),
  cremationDoctor: z.boolean().default(false),
  afterHour: z.boolean().default(false),
  amountPaid: z.coerce.number().default(0),
  notes: z.string().max(190).default(''),
  createdBy: z.string(),
});

type ArrangementFormValues = z.infer<typeof formSchema>;

const ArrangementForm: React.FC<ArrangementFormProps> = ({
  initialData,
  tombstones,
  coffins,
}) => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { user, error, isLoading } = useUser();

  const title = initialData ? 'Edit Arrangement' : 'Funeral Arrangement';
  const description = initialData
    ? 'Make changes to existing funeral arrangement.'
    : 'Create a new funeral arrangement';
  const toastMessage = initialData
    ? 'Changes successfully applied.'
    : 'Funeral Arrangement created successfully';
  const action = initialData ? 'Save changes' : 'Add Funeral Arrangement';

  const form = useForm<ArrangementFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          coffinid: initialData.coffinId,
          tombstoneId: initialData.tombstoneId,
          deliveryTime: initialData.DeliveryTime,
        }
      : {
          familyReps: [
            { firstName: '', lastName: '', relationship: '', phoneNo: '' },
          ],
          deceased: {
            dateOfDeath: new Date(),
            ffhMemberNo: '',
            lastName: '',
            firstNames: '',
            idNumber: '',
            removalDate: new Date(),
            removalFrom: {
              street: '',
              city: '',
              province: '',
              zip: '',
            },
            deathCertificateRecipient: '',
            dateOfFuneralService: new Date(),
          },
          deliveryAddress: '',
          deliveryTime: '',
          church: {
            churchName: '',
            Address: {
              street: '',
              city: '',
              province: '',
              zip: '',
            },
          },
          minister: {
            firstName: '',
            lastName: '',
            phoneNo: '',
          },
          crossSize: '',
          cemetry: {
            cemetryName: '',
            time: '',
          },
          doves: false,
          programs: 50,
          bus: false,
          car: false,
          wreaths: false,
          storageDays: 1,
          decor: {
            candle: false,
            photo: false,
            glass: false,
            banner: false,
          },
          tombstoneId: '',
          totalPayable: 0,
          amountPaid: 0,
          notes: '',
          doctor: false,
          cremationDoctor: false,
          coffinid: '',
          createdBy: 'email',
        },
  });

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = form;

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: 'familyReps',
      rules: {
        minLength: 1,
      },
    }
  );

  const onSubmit = async (data: ArrangementFormValues) => {
    try {
      setLoading(true);
      console.log(data);

      if (!error || !isLoading) {
        if (user?.email) {
          data.createdBy = user.email;
        }
      }
      data.totalPayable = 20000;
      data.amountPaid = 1000;

      if (initialData) {
        await axios.patch(`/api/arrangement/${initialData.id}`, data);
      } else {
        await axios.post('/api/arrangement', data);
      }

      router.push('/arrangements');
      router.refresh();
      toast.success(toastMessage);
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Heading title={title} subtitle={description} />
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="w-1/2 mb-20">
          {/* Deceased details */}
          <section className="w-full ">
            <h1 className="text-xl font-semibold">Details of Deceased</h1>
            <hr className="w-full my-2" />

            <div className="flex flex-col gap-y-5">
              <FormField
                control={form.control}
                name="deceased.dateOfDeath"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Death:*</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal ',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span className="text-gray-400">Select date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto bg-primary-foreground p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
              <div className="flex md:flex-row flex-col w-full gap-x-2">
                <FormField
                  control={form.control}
                  name="deceased.ffhMemberNo"
                  render={({ field }) => (
                    <FormItem className=" w-full md:w-1/2 xl:w-1/2">
                      <FormLabel className="font-semibold">
                        FFH Member No.
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Member No."
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="deceased.idNumber"
                  render={({ field }) => (
                    <FormItem className=" w-full md:w-1/2 xl:w-1/2">
                      <FormLabel className="font-semibold">ID Number</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="ID Number"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col md:flex-row w-full gap-x-2">
                <FormField
                  control={form.control}
                  name="deceased.firstNames"
                  render={({ field }) => (
                    <FormItem className=" w-full md:w-1/2 xl:1/2">
                      <FormLabel className="font-semibold">
                        First Names
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="First Names"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="deceased.lastName"
                  render={({ field }) => (
                    <FormItem className=" w-full md:w-1/2 xl:1/2">
                      <FormLabel className="font-semibold">Last Name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Last Names"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="deceased.deathCertificateRecipient"
                render={({ field }) => (
                  <FormItem className=" flex-1 md:w-1/2 xl:flex-auto">
                    <FormLabel className="font-semibold">
                      Death Certificate Recipient
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Street name"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deceased.removalDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Removal:*</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal ',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span className="text-gray-400">Select date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto bg-primary-foreground p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deceased.dateOfFuneralService"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Funeral Service:*</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal ',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span className="text-gray-400">Select date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto bg-primary-foreground p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
              <div className="flex flex-col">
                <h2 className="text-xl font-semibold">
                  Removal Address Details:
                </h2>
                <hr className="w-full my-2" />

                <div className="flex flex-wrap gap-x-2 gap-y-2">
                  <FormField
                    control={form.control}
                    name="deceased.removalFrom.street"
                    render={({ field }) => (
                      <FormItem className=" flex-1 md:w-1/2 xl:flex-auto">
                        <FormLabel className="font-semibold">
                          Street Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder="Street name"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="deceased.removalFrom.city"
                    render={({ field }) => (
                      <FormItem className=" w-full md:w-1/2 xl:flex-shrink">
                        <FormLabel className="font-semibold">City</FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder="City"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="deceased.removalFrom.province"
                    render={({ field }) => (
                      <FormItem className=" w-full md:flex-shrink xl:flex-1">
                        <FormLabel className="font-semibold">
                          Province
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder="Province"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="deceased.removalFrom.zip"
                    render={({ field }) => (
                      <FormItem className=" w-full md:w-1/4 xl:flex-1">
                        <FormLabel className="font-semibold">Zip</FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder="Zip"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Family Reps */}

          <section className="mt-10 w-full ">
            <div className="flex justify-between">
              <h1 className="text-xl font-semibold">
                Details of Family Representatives
              </h1>

              <Plus
                className="h-8 w-8"
                onClick={() =>
                  append({
                    lastName: '',
                    firstName: '',
                    relationship: '',
                    phoneNo: '',
                  })
                }
              />
            </div>

            <hr className="w-full my-4" />
            <div className="grid grid-cols-5 w-full gap-2">
              <h2 className="col-start-1 font-semibold">Surname</h2>
              <h2 className="col-start-2 font-semibold">Name</h2>
              <h2 className="col-start-3 font-semibold">Relationship</h2>
              <h2 className="col-start-4 font-semibold">Phone No.</h2>
              {fields.map((field, index) => (
                <>
                  <FormItem className={cn('w-full  col-start-1')}>
                    <FormControl>
                      <Input
                        key={field.id} // important to include key with field's id
                        {...register(`familyReps.${index}.lastName` as const)}
                        placeholder="Surname"
                      />
                    </FormControl>
                  </FormItem>
                  <FormItem className={cn('w-full  col-start-2')}>
                    <FormControl>
                      <Input
                        key={field.id} // important to include key with field's id
                        {...register(`familyReps.${index}.firstName` as const)}
                        placeholder="First Name"
                      />
                    </FormControl>
                  </FormItem>
                  <FormItem className={cn('w-full  col-start-3')}>
                    <FormControl>
                      <Input
                        key={field.id} // important to include key with field's id
                        {...register(
                          `familyReps.${index}.relationship` as const
                        )}
                        placeholder="First Name"
                      />
                    </FormControl>
                  </FormItem>
                  <FormItem className={cn('w-full  col-start-4')}>
                    <FormControl>
                      <Input
                        key={field.id} // important to include key with field's id
                        {...register(`familyReps.${index}.phoneNo` as const)}
                        placeholder="Phone No."
                      />
                    </FormControl>
                  </FormItem>
                  <Trash
                    className="h-8 w-8 col-start-5 justify-self-end "
                    onClick={() => remove(index)}
                  />
                </>
              ))}
            </div>
          </section>

          {/* Arrangements */}

          <section className="mt-10 w-full ">
            <h1 className="text-xl font-semibold">Arrangements Details</h1>
            <hr className="w-full my-4" />
            <div className="w-full flex gap-x-4">
              <div className="flex flex-col w-1/2">
                <div className="w-full mb-5 flex flex-col gap-y-2">
                  <h2 className="text-lg mb-2 font-semibold">Home</h2>
                  <FormField
                    control={form.control}
                    name="deliveryAddress"
                    render={({ field }) => (
                      <FormItem className=" w-full">
                        <FormLabel className="font-semibold">
                          Delivery Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder="Delivery Address"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="deliveryTime"
                    render={({ field }) => (
                      <FormItem className=" w-full">
                        <FormLabel className="font-semibold">
                          Delivery Time
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder="Delivery Time"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-col w-full gap-y-2">
                  <h2 className="text-lg mb-2 font-semibold">Church</h2>
                  <FormField
                    control={form.control}
                    name="church.churchName"
                    render={({ field }) => (
                      <FormItem className=" w-full">
                        <FormLabel className="font-semibold">
                          Church Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder="Church name"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-wrap gap-x-2 gap-y-2">
                    <FormField
                      control={form.control}
                      name="church.Address.street"
                      render={({ field }) => (
                        <FormItem className=" flex-1 md:w-1/2 xl:flex-auto">
                          <FormLabel className="font-semibold">
                            Street Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              disabled={loading}
                              placeholder="Street name"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="church.Address.city"
                      render={({ field }) => (
                        <FormItem className=" w-full md:w-1/2 xl:flex-grow">
                          <FormLabel className="font-semibold">City</FormLabel>
                          <FormControl>
                            <Input
                              disabled={loading}
                              placeholder="City"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="church.Address.province"
                      render={({ field }) => (
                        <FormItem className="flex-auto">
                          <FormLabel className="font-semibold">
                            Province
                          </FormLabel>
                          <FormControl>
                            <Input
                              disabled={loading}
                              placeholder="Province"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="church.Address.zip"
                      render={({ field }) => (
                        <FormItem className="w-1/4">
                          <FormLabel className="font-semibold">Zip</FormLabel>
                          <FormControl>
                            <Input
                              disabled={loading}
                              placeholder="Zip"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex flex-col w-full gap-y-2 mt-5">
                  <h2 className="text-lg mb-2 font-semibold">Cemetry</h2>
                  <FormField
                    control={form.control}
                    name="cemetry.cemetryName"
                    render={({ field }) => (
                      <FormItem className=" w-full">
                        <FormLabel className="font-semibold">
                          Cemetry Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder="Church name"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cemetry.time"
                    render={({ field }) => (
                      <FormItem className=" w-1/2">
                        <FormLabel className="font-semibold">
                          Cemetry Time
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder="Time"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col gap-y-2 mt-10">
                  <h2 className="text-lg mb-2 font-semibold">
                    Minister Information
                  </h2>
                  <div className="flex flex-row w-full gap-x-2">
                    <FormField
                      control={form.control}
                      name="minister.firstName"
                      render={({ field }) => (
                        <FormItem className="w-1/2">
                          <FormLabel className="font-semibold">
                            First Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              disabled={loading}
                              placeholder="First Name"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="minister.lastName"
                      render={({ field }) => (
                        <FormItem className="w-1/2">
                          <FormLabel className="font-semibold">
                            Last Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              disabled={loading}
                              placeholder="Last Name"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="minister.phoneNo"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="font-semibold">
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder="Phone No"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Notes provided by family"
                            className="resize-y max-h-44"
                            {...field}
                            maxLength={190}
                          />
                        </FormControl>
                        <FormDescription>
                          Additional Information provided by family rep or
                          minister. Max 190 characters
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex flex-col w-1/2 gap-y-4 ">
                <div className="flex flex-col w-full gap-y-2">
                  <h2 className="text-lg mb-2 font-semibold">Grave Site</h2>
                  <FormField
                    control={form.control}
                    name="coffinid"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Coffin</FormLabel>
                        <Select
                          disabled={loading}
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                defaultValue={field.value}
                                placeholder="Select Coffin"
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {coffins.map((coffin) => (
                              <SelectItem value={coffin.id} key={coffin.id}>
                                {coffin.coffinName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <div className="flex flex-col gap-y-4 mt-2">
                    <FormField
                      control={form.control}
                      name="crossSize"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="font-semibold">
                            Cross Size
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="small" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Small
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="big" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Big
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex flex-col w-full gap-y-2">
                  <div className="flex flex-col w-full gap-y-2">
                    <h2 className="text-lg  font-semibold">Extras</h2>
                    <FormField
                      control={form.control}
                      name="programs"
                      render={({ field }) => (
                        <FormItem className="space-y-3 gap-x-2 mb-2 flex text-center items-baseline">
                          <FormLabel className="font-semibold">
                            Programs
                          </FormLabel>
                          <FormControl>
                            <Input
                              disabled={loading}
                              placeholder="50 or 100"
                              {...field}
                              className="w-1/4"
                              type="number"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="tombstoneId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">
                            Tombstone
                          </FormLabel>
                          <Select
                            disabled={loading}
                            onValueChange={field.onChange}
                            value={field.value}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  defaultValue={field.value}
                                  placeholder="Select Tombstone"
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {tombstones.map((tombstone) => (
                                <SelectItem
                                  value={tombstone.id}
                                  key={tombstone.id}
                                >
                                  {tombstone.type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="doves"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={() =>
                                field.onChange(!field.value)
                              }
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Doves</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="wreaths"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={() =>
                                field.onChange(!field.value)
                              }
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Wreaths</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="liveStreaming"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={() =>
                                field.onChange(!field.value)
                              }
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Live Streaming</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bus"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={() =>
                                field.onChange(!field.value)
                              }
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Bus from Home</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="car"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={() =>
                                field.onChange(!field.value)
                              }
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Family Car from Home</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex flex-col gap-y-2">
                    <h2 className="text-lg mb-2 font-semibold">Decor</h2>
                    <FormField
                      control={form.control}
                      name="decor.banner"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={() =>
                                field.onChange(!field.value)
                              }
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Banner</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="decor.candle"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={() =>
                                field.onChange(!field.value)
                              }
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Candle</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="decor.photo"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={() =>
                                field.onChange(!field.value)
                              }
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Photo</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="decor.glass"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={() =>
                                field.onChange(!field.value)
                              }
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Glass</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/**Add ons */}
          <section className=" w-full my-5">
            <h1 className="text-xl font-semibold">Add Ons</h1>
            <hr className="w-full my-4" />

            <FormField
              control={form.control}
              name="storageDays"
              render={({ field }) => (
                <FormItem className=" mb-5 flex items-baseline gap-x-2">
                  <FormLabel className="font-semibold">
                    Storage @ R300/day
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="4"
                      {...field}
                      className="w-20"
                      type="number"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-y-2">
              <FormField
                control={form.control}
                name="doctor"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={() => field.onChange(!field.value)}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Doctor (R550)</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="afterHour"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={() => field.onChange(!field.value)}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>After Hour (R3 000)</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cremationDoctor"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={() => field.onChange(!field.value)}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Cremation Doctor (R3 000)</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </section>

          <section className="flex flex-col mt-10 w-full  text-right">
            <h1 className="text-xl font-semibold">Summary</h1>
            <hr className="w-full my-4" />
            <div className="w-full flex flex-row justify-end items-center">
              <h2 className="text-xl mr-2">Amount Paid: </h2>
              <FormField
                control={form.control}
                name="amountPaid"
                render={({ field }) => (
                  <FormItem className="space-y-3 gap-x-2 mb-2 flex text-center items-baseline">
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="50 or 100"
                        {...field}
                        className="w-full"
                        type="number"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full flex flex-row justify-end items-center">
              <h2 className="text-xl mr-2">Total Payable: </h2>
              <FormField
                control={form.control}
                name="totalPayable"
                render={({ field }) => (
                  <FormItem className="space-y-3 gap-x-2 mb-2 flex text-center items-baseline">
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="50 or 100"
                        {...field}
                        className="w-full"
                        type="number"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <hr className="w-full my-4" />
          </section>

          <section className="flex w-full gap-x-2 justify-end">
            <Button variant={'outline'} onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" className="w-48 font-semibold">
              {action}
            </Button>
          </section>
        </form>
      </Form>
    </>
  );
};

export default ArrangementForm;
