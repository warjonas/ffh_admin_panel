'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn, formatter } from '@/lib/utils';
import { Coffin, Tombstone } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, Plus, Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react';
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
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';

import { revalidatePath } from 'next/cache';
import { Arrangement, Deceased } from '@prisma/client';
import useSWR, { SWRConfiguration } from 'swr';
import { Modal } from '../ui/modal';
import { useArrangementModal } from '@/hooks/use-arrangement-modal';
import DeceasedList from '../deceased-list';
import NextDatePicker from '../ui/custom-datepicker';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const formSchema = z.object({
  deceased: z.string(),
  dateOfFuneralService: z.date(),
  familyReps: z
    .object({
      firstName: z.string(),
      lastName: z.string(),
      relationship: z.string(),
      phoneNo: z.string(),
    })
    .array(),
  deliveryAddress: z.string(),
  deliveryTime: z.string(),
  church: z.object({
    churchName: z.string(),
    time: z.string(),
    Address: z.object({
      street: z.string(),
      city: z.string(),
    }),
  }),
  minister: z.object({
    firstName: z.string(),
    lastName: z.string(),
    phoneNo: z.string(),
  }),
  crossSize: z.string(),
  cemetry: z.object({
    cemetryName: z.string(),
    time: z.string(),
  }),
  doves: z.coerce.number(),
  liveStreaming: z.coerce.number(),
  programs: z.coerce.number(),
  bus: z.coerce.number(),
  car: z.coerce.number(),
  wreaths: z.coerce.number(),

  storage: z.coerce.number().min(1),
  decor: z.object({
    candle: z.boolean().default(false),
    photo: z.boolean().default(false),
    glass: z.boolean().default(false),
    banner: z.boolean().default(false),
  }),
  tombstoneId: z.string(),
  coffinid: z.string(),
  totalDue: z.coerce.number().default(10000),
  outstandingBalance: z.coerce.number(),
  doctor: z.coerce.number(),
  cremationDoctor: z.coerce.number(),
  afterHour: z.coerce.number(),
  digger: z.coerce.number(),

  amountPaid: z.coerce.number().default(0),
  notes: z.string().max(190).default(''),
  createdBy: z.string(),
  updatedBy: z.string(),
});

type ArrangementFormValues = z.infer<typeof formSchema>;

const AddArrangmentModal = () => {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const arrangementModal = useArrangementModal();
  const deceasedId = searchParams.get('deceasedId');
  const arrangementId = searchParams.get('arrangementId');
  const [isMounted, setIsMounted] = useState(false);
  const [amountDue, setAmountDue] = useState(0);

  const router = useRouter();
  const { user, error, isLoading } = useUser();

  const config: SWRConfiguration = {
    revalidateOnFocus: true,
    revalidateIfStale: false,
    revalidateOnMount: true,
  };

  const {
    data: initialData,
    error: initialDataError,
    isLoading: initialDataLoading,
  }: { data: Arrangement; error: any; isLoading: any } = useSWR(
    arrangementId ? `/api/arrangement/${arrangementId}` : null,
    fetcher,
    config
  );

  const {
    data: deceasedData,
    error: deceasedError,
    isLoading: deceasedLoading,
  }: { data: Deceased[]; error: any; isLoading: any } = useSWR(
    `/api/deceased`,
    fetcher,
    config
  );

  const {
    data: tombstones,
    error: tombstonesError,
    isLoading: tombstonesLoading,
  }: { data: Tombstone[]; error: any; isLoading: any } = useSWR(
    `/api/tombstone`,
    fetcher,
    config
  );

  const {
    data: coffins,
    error: coffinsError,
    isLoading: coffinsLoading,
  }: { data: Coffin[]; error: any; isLoading: any } = useSWR(
    `/api/coffin`,
    fetcher,
    config
  );

  const toastMessage = initialData
    ? 'Changes successfully applied.'
    : 'Funeral Arrangement created successfully';
  const action = initialData ? 'Save changes' : 'Add Funeral Arrangement';

  const form = useForm<ArrangementFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      familyReps: [
        { firstName: '', lastName: '', relationship: '', phoneNo: '' },
      ],
      deceased: '',
      deliveryAddress: '',
      deliveryTime: '',
      church: {
        churchName: '',
        time: '',
        Address: {
          street: '',
          city: '',
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
      digger: 800,
      doves: 0,
      programs: 50,
      bus: 0,
      car: 0,
      wreaths: 0,
      storage: 1,
      liveStreaming: 0,
      afterHour: 0,
      decor: {
        candle: false,
        photo: false,
        glass: false,
        banner: false,
      },
      tombstoneId: '658436d1de42bdd8d5632f85',
      totalDue: amountDue,
      outstandingBalance: 0,
      notes: '',
      doctor: 0,
      cremationDoctor: 0,
      coffinid: '65d30ab955df5069abb2bd0d',
      createdBy: 'email',
      updatedBy: '',
    },
  });

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    watch,
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

  useEffect(() => {
    const total =
      Number(form.getValues().cremationDoctor) +
      Number(form.getValues().doctor) +
      Number(form.getValues().bus) +
      Number(form.getValues().storage) +
      Number(form.getValues().liveStreaming) +
      Number(form.getValues().doves) +
      Number(form.getValues().wreaths) +
      Number(form.getValues().afterHour) +
      Number(form.getValues().car);

    setAmountDue(total);
  }, [
    watch([
      'cremationDoctor',
      'doctor',
      'storage',
      'liveStreaming',
      'car',
      'bus',
      'wreaths',
      'doves',
      'afterHour',
    ]),
  ]);

  const onSubmit = async (data: ArrangementFormValues) => {
    if (!deceasedId) {
      form.setError('deceased', { message: 'Deceased ID is required' });
      throw error;
    }

    data.deceased = deceasedId;
    data.totalDue = amountDue;
    data.outstandingBalance = amountDue;

    try {
      setLoading(true);

      if (initialData) {
        if (!error || !isLoading) {
          if (user?.name) {
            data.updatedBy = user.name;
          }
        }
        await axios.patch(`/api/arrangement/${arrangementId}`, data);
      } else {
        if (!error || !isLoading) {
          if (user?.name) {
            data.createdBy = user.name;
          }
        }
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

  const onClose = () => {
    arrangementModal.onClose();

    router.push('/arrangements');
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (initialData && deceasedId) {
      setValue('deceased', initialData.deceasedId);

      if (initialData.dateOfFuneralService) {
        setValue(
          'dateOfFuneralService',
          new Date(initialData.dateOfFuneralService)
        );
      }

      setValue('bus', initialData.bus);
      setValue('car', initialData.familyCar);
      setValue('afterHour', initialData.afterHour);
      if (initialData.cemetry) setValue('cemetry', initialData.cemetry);
      if (initialData.church) setValue('church', initialData.church);
      if (initialData.familyReps)
        setValue('familyReps', initialData.familyReps);
      if (initialData.coffinId) setValue('coffinid', initialData.coffinId);
      setValue('liveStreaming', initialData.liveStreaming);
      setValue('doctor', initialData.doctor);
      if (initialData.programs) setValue('programs', initialData.programs);
      if (initialData.minister) setValue('minister', initialData.minister);

      setValue('totalDue', initialData.totalDue);
      setValue('doves', initialData.doves);
      setValue('notes', initialData.notes);

      if (initialData.storage) setValue('storage', initialData.storage);

      setValue('cremationDoctor', initialData.cremationDoctor);
      if (initialData.crossSize) setValue('crossSize', initialData.crossSize);
      if (initialData.decor) setValue('decor', initialData.decor);
    }
  }, [deceasedId, initialData]);

  if (!isMounted) {
    return null;
  }

  if (isLoading && !initialDataError) {
    return (
      <Modal
        title={`Loading`}
        description=""
        isOpen={arrangementModal.isOpen}
        onClose={arrangementModal.onClose}
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
      title="Funeral Arrangement"
      description="Manage funeral arrangement details"
      isOpen={arrangementModal.isOpen}
      onClose={onClose}
    >
      <div className="flex flex-col  gap-x-2 mb-5">
        <div className="flex flex-col w-full ">
          <h1 className="text-lg">For the late: </h1>

          {deceasedLoading ? (
            <div
              className="inline-block h-4 w-4 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status"
            >
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
          ) : (
            <DeceasedList
              items={deceasedData}
              disabled={initialData ? true : false}
            />
          )}
        </div>

        {deceasedId ? (
          <></>
        ) : (
          <h1 className="text-red-500 mt-2">
            Please select deceased from the list above
          </h1>
        )}
      </div>
      <hr className="my-3 w-full border-primary border-slate-200" />

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className=" w-full mb-20">
          {/* Deceased details */}
          <section className="w-full ">
            <div className="flex flex-col gap-y-5">
              <FormField
                control={form.control}
                name="dateOfFuneralService"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Funeral Service:*</FormLabel>
                    <div className="relative">
                      <NextDatePicker
                        onChange={field.onChange}
                        value={field.value}
                        maxDate={new Date()}
                      />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </section>

          {/* Family Reps */}

          <section className="mt-10 w-full ">
            <div className="flex justify-between">
              <h1 className="text-xl font-semibold">
                Details of Family Representatives{' '}
                <span className="text-sm">(min 1)</span>
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
                      name="church.time"
                      render={({ field }) => (
                        <FormItem className=" w-1/2">
                          <FormLabel className="font-semibold">
                            Removal Time
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
                        <FormLabel>Notes</FormLabel>
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
                        <FormMessage />
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
                        {coffinsLoading ? (
                          <div
                            className="inline-block h-4 w-4 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                            role="status"
                          >
                            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                              Loading...
                            </span>
                          </div>
                        ) : (
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
                        )}
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

                          {tombstonesLoading ? (
                            <div
                              className="inline-block h-4 w-4 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                              role="status"
                            >
                              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                                Loading...
                              </span>
                            </div>
                          ) : (
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
                          )}
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
              name="storage"
              disabled
              render={({ field }) => (
                <FormItem className=" mb-5 flex items-baseline gap-x-2">
                  <FormLabel className="font-semibold">
                    Storage @ R350/day
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
                name="doves"
                render={({ field }) => (
                  <FormItem className="space-y-3 gap-x-2 mb-2 flex text-center items-baseline">
                    <FormLabel className="font-semibold w-32 text-left">
                      Doves
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="0"
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
                name="wreaths"
                render={({ field }) => (
                  <FormItem className="space-y-3 gap-x-2 mb-2 flex text-center items-baseline">
                    <FormLabel className="font-semibold w-32 text-left">
                      Wreaths
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="0"
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
                name="liveStreaming"
                render={({ field }) => (
                  <FormItem className="space-y-3 gap-x-2 mb-2 flex text-center items-baseline">
                    <FormLabel className="font-semibold w-32 text-left">
                      Live Streaming
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="0"
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
                name="bus"
                render={({ field }) => (
                  <FormItem className="space-y-3 gap-x-2 mb-2 flex text-center items-baseline">
                    <FormLabel className="font-semibold w-32 text-left">
                      Bus{' '}
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="0"
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
                name="car"
                render={({ field }) => (
                  <FormItem className="space-y-3 gap-x-2 mb-2 flex text-center items-baseline">
                    <FormLabel className="font-semibold w-32 text-left">
                      Car
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="0"
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
                name="doctor"
                render={({ field }) => (
                  <FormItem className="space-y-3 gap-x-2 mb-2 flex text-center items-baseline">
                    <FormLabel className="font-semibold w-32 text-left">
                      Live Streaming
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="0"
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
                name="afterHour"
                render={({ field }) => (
                  <FormItem className="space-y-3 gap-x-2 mb-2 flex text-center items-baseline">
                    <FormLabel className="font-semibold w-32 text-left">
                      After hours{' '}
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="0"
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
                name="cremationDoctor"
                render={({ field }) => (
                  <FormItem className="space-y-3 gap-x-2 mb-2 flex text-center items-baseline">
                    <FormLabel className="font-semibold w-32 text-left">
                      Cremation Doctor{' '}
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="0"
                        {...field}
                        className="w-1/4"
                        type="number"
                      />
                    </FormControl>
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
            </div>
            <div className="w-full flex flex-row justify-end items-center">
              <h2 className="text-xl mr-2">Total Payable: </h2>
              <h1 className="text-xl font-semibold text-end">
                {formatter.format(amountDue)}{' '}
              </h1>
            </div>

            <hr className="w-full my-4" />
          </section>

          <section className="flex w-full gap-x-2 justify-end">
            <Button
              type="submit"
              className="w-48 font-semibold"
              disabled={deceasedId === null}
            >
              {action}
            </Button>
          </section>
        </form>
      </Form>
    </Modal>
  );
};

export default AddArrangmentModal;
