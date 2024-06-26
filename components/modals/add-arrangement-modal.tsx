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

import { cn, formatter } from '@/lib/utils';
import {
  AddOn,
  ArrangementAddOnItem,
  Coffin,
  CrossSize,
  Grave,
  Tombstone,
} from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, Plus, RefreshCcw, Trash, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
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
import { Arrangement, Deceased } from '@/types';
import useSWR, { SWRConfiguration } from 'swr';
import { Modal } from '../ui/modal';
import { useArrangementModal } from '@/hooks/use-arrangement-modal';
import DeceasedList from '../deceased-list';
import NextDatePicker from '../ui/custom-datepicker';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const calculate_storageDays = (date1: Date, date2: Date) => {
  let timeDifference = date2.getTime() - date1.getTime();

  let days = Math.round(timeDifference / (1000 * 3600 * 24));

  return days + 1;
};

const calculate_storageFee = (date1: Date, date2: Date, storageFee: any) => {
  let days = calculate_storageDays(date1, date2);
  let fee = storageFee * days;

  return fee;
};

const formSchema = z.object({
  deceased: z.string(),
  dateOfFuneralService: z.date(),
  familyReps: z
    .object({
      firstName: z.string(),
      lastName: z.string(),
      relationship: z.string(),
      phoneNo: z.string(),
      email: z.string(),
    })
    .array(),
  digger: z.object({
    qty: z.coerce.number(),
    price: z.coerce.number(),
  }),
  bus: z.object({
    qty: z.coerce.number(),
    price: z.coerce.number(),
  }),
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
  crossSizeId: z.string(),
  graveId: z.string(),
  graveTime: z.string(),
  graveNo: z.string(),
  arrangementAddOnItems: z
    .object({
      name: z.string().min(1),
      qty: z.coerce.number().default(0),
      price: z.coerce.number(),
    })
    .array(),

  storage: z.coerce.number().default(350),
  storageDays: z.coerce.number(),
  decor: z.object({
    candle: z.object({
      qty: z.coerce.number(),
      price: z.coerce.number(),
    }),
    photo: z.object({
      qty: z.coerce.number(),
      price: z.coerce.number(),
    }),
    glass: z.object({
      qty: z.coerce.number(),
      price: z.coerce.number(),
    }),
    banner: z.object({
      qty: z.coerce.number(),
      price: z.coerce.number(),
    }),
  }),
  tombstoneId: z.string(),
  coffinId: z.string(),
  totalDue: z.coerce.number().default(350),
  outstandingBalance: z.coerce.number(),

  paidUp: z.boolean(),
  additionalItems: z
    .object({
      description: z.string(),
      amount: z.coerce.number(),
    })
    .array(),
  discount: z.coerce.number().default(0),
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
  const [storageFee, setStorageFee] = useState(350);
  const [coffinFee, setCoffinFee] = useState(0);
  const [tombstoneFee, setTombstoneFee] = useState(0);
  const [graveFee, setGraveFee] = useState(0);
  const [crossFee, setCrossFee] = useState(0);

  const [additionalItems, setAdditionalItems] = useState(0);
  const [addOnTotal, setAddOnTotal] = useState(0);

  const [paymentsMade, setPaymentsMade] = useState(0);

  const router = useRouter();
  const { user, error, isLoading } = useUser();

  const config: SWRConfiguration = {
    revalidateOnFocus: true,
    revalidateIfStale: true,
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
    { refreshInterval: 1000 }
  );

  const {
    data: addOnData,
    error: addOnsError,
    isLoading: addOnsLoading,
  }: { data: AddOn[]; error: any; isLoading: any } = useSWR(
    `/api/addOn`,
    fetcher,
    { refreshInterval: 1000 }
  );

  const {
    data: tombstones,
    error: tombstonesError,
    isLoading: tombstonesLoading,
  }: { data: Tombstone[]; error: any; isLoading: any } = useSWR(
    `/api/tombstone`,
    fetcher,
    { refreshInterval: 1000 }
  );

  const {
    data: graves,
    error: gravesError,
    isLoading: gravesLoading,
  }: { data: Grave[]; error: any; isLoading: any } = useSWR(
    `/api/grave`,
    fetcher,
    { refreshInterval: 1000 }
  );

  const {
    data: coffins,
    error: coffinsError,
    isLoading: coffinsLoading,
  }: { data: Coffin[]; error: any; isLoading: any } = useSWR(
    `/api/coffin`,
    fetcher,
    { refreshInterval: 1000 }
  );

  const {
    data: crosses,
    error: crossesError,
    isLoading: crossesLoading,
  }: { data: CrossSize[]; error: any; isLoading: any } = useSWR(
    `/api/cross`,
    fetcher,
    { refreshInterval: 1000 }
  );

  const toastMessage = initialData
    ? 'Changes successfully applied.'
    : 'Funeral Arrangement created successfully';
  const action = initialData ? 'Save changes' : 'Add Funeral Arrangement';

  const form = useForm<ArrangementFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      familyReps: [
        {
          firstName: '',
          lastName: '',
          relationship: '',
          phoneNo: '',
          email: '',
        },
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
      crossSize: 'deprecated',
      crossSizeId: '6674a59457d812d09c7f7aff',
      graveId: '6616593b149f9c78856cc0d2',
      graveTime: '',
      graveNo: '',
      bus: {
        qty: 0,
        price: 0,
      },
      digger: {
        qty: 0,
        price: 0,
      },

      storage: storageFee,
      storageDays: 0,

      decor: {
        candle: {
          qty: 0,
          price: 0,
        },
        photo: {
          qty: 0,
          price: 0,
        },
        glass: {
          qty: 0,
          price: 0,
        },
        banner: {
          qty: 0,
          price: 0,
        },
      },
      tombstoneId: '66158c06a8cfcff52ed32d68',
      totalDue: 0,
      outstandingBalance: 0,
      notes: '',
      discount: 0,
      coffinId: '6614467780ae4f6405b2faeb',
      createdBy: 'email',
      updatedBy: '',
      paidUp: false,
      additionalItems: [
        {
          description: '',
          amount: 0,
        },
      ],
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

  const {
    fields: addOnFields,
    append: addOnItemsAppend,
    remove: addOnItemsRemove,
    replace: addOnReplace,
  } = useFieldArray({
    control,
    name: 'arrangementAddOnItems',
  });

  const {
    fields: additionalFields,
    append: additionalItemsAppend,
    prepend: additionalItemsPrepend,
    remove: additionalItemsRemove,
    swap: additionalItemsSwap,
    move: additionalItemsMove,
    insert: additionalItemsInsert,
    replace: additionalItemsReplace,
  } = useFieldArray({
    control,
    name: 'additionalItems',
  });

  //Calculates the total for the additional items that are added
  useEffect(() => {
    const itemsAmount = additionalFields.reduce((total, item) => {
      return total + Number(item.amount);
    }, 0);

    setAdditionalItems(itemsAmount);
  }, [watch(['additionalItems']), additionalFields]);

  //Calculates the total for the add on items that are added
  useEffect(() => {
    if (isMounted) {
      const itemsAmount = form
        .getValues()
        .arrangementAddOnItems.reduce((total, item) => {
          return total + Number(item.qty * item.price);
        }, 0);

      setAddOnTotal(itemsAmount);
    }
  }, [watch(['arrangementAddOnItems'])]);

  //sets the total due on the form to the amount calculated below
  useEffect(() => {
    setValue('totalDue', amountDue);
  }, [amountDue]);

  //finds price of selected grave and adds it to the ammount due
  useEffect(() => {
    if (graves) {
      let itemsAmount = graves.find(
        (item) => item.id === form.getValues().graveId
      );

      itemsAmount && setGraveFee(itemsAmount.price);
    }
  }, [watch('graveId')]);

  //finds price of selected coffin and adds it to the ammount due
  useEffect(() => {
    if (coffins) {
      let itemsAmount = coffins.find(
        (item) => item.id === form.getValues().coffinId
      );

      itemsAmount && setCoffinFee(itemsAmount.price);
    }
  }, [watch('coffinId')]);

  //finds price of selected cross size and adds it to the ammount due
  useEffect(() => {
    if (crosses) {
      let itemsAmount = crosses.find(
        (item) => item.id === form.getValues().crossSizeId
      );

      itemsAmount && setCrossFee(itemsAmount.price);
    }
  }, [watch('crossSizeId')]);

  //finds price of selected tombstone and adds it to the ammount due
  useEffect(() => {
    if (tombstones) {
      let itemsAmount = tombstones.find(
        (item) => item.id === form.getValues().tombstoneId
      );

      itemsAmount && setTombstoneFee(itemsAmount.price);
    }
  }, [watch('tombstoneId')]);

  //Calculates total of all the add-ons and sets it as the amount due
  // useEffect(() => {
  //   const total =
  //     storageFee +
  //     Number(form.getValues().bus.qty * form.getValues().bus.price) +
  //     Number(form.getValues().digger.qty * form.getValues().digger.price) +
  //     Number(
  //       form.getValues().decor.banner.qty * form.getValues().decor.banner.price
  //     ) +
  //     Number(
  //       form.getValues().decor.photo.qty * form.getValues().decor.photo.price
  //     ) +
  //     Number(
  //       form.getValues().decor.glass.qty * form.getValues().decor.glass.price
  //     ) +
  //     Number(
  //       form.getValues().decor.candle.qty * form.getValues().decor.candle.price
  //     ) +
  //     additionalItems +
  //     coffinFee +
  //     tombstoneFee +
  //     graveFee +
  //     addOnTotal;

  //   setAmountDue(total - form.getValues().discount);
  // }, [
  //   watch([
  //     'decor.glass',
  //     'decor.photo',
  //     'decor.candle',
  //     'decor.banner',
  //     'discount',
  //     'bus',
  //     'digger',
  //   ]),
  //   storageFee,
  //   additionalItems,
  //   amountDue,
  //   coffinFee,
  //   tombstoneFee,
  //   graveFee,
  //   addOnTotal,
  // ]);

  const calculateTotal = () => {
    const total =
      storageFee +
      Number(form.getValues().bus.qty * form.getValues().bus.price) +
      Number(form.getValues().digger.qty * form.getValues().digger.price) +
      Number(
        form.getValues().decor.banner.qty * form.getValues().decor.banner.price
      ) +
      Number(
        form.getValues().decor.photo.qty * form.getValues().decor.photo.price
      ) +
      Number(
        form.getValues().decor.glass.qty * form.getValues().decor.glass.price
      ) +
      Number(
        form.getValues().decor.candle.qty * form.getValues().decor.candle.price
      ) +
      additionalItems +
      coffinFee +
      crossFee +
      tombstoneFee +
      graveFee +
      addOnTotal;

    setAmountDue(total - form.getValues().discount);
  };

  //Calculate the storage fee based on the funeral date selected and the day body was received

  useEffect(() => {
    let deceasedDate = deceasedData?.find((c) => c.id === deceasedId);

    if (deceasedDate && deceasedId) {
      setValue(
        'storage',
        calculate_storageFee(
          new Date(deceasedDate.removalDate),
          new Date(form.getValues().dateOfFuneralService),
          350
        )
      );

      setStorageFee(
        calculate_storageFee(
          new Date(deceasedDate.removalDate),
          new Date(form.getValues().dateOfFuneralService),
          350
        )
      );
    }
  }, [deceasedData, deceasedId, watch('dateOfFuneralService')]);

  useEffect(() => {
    calculateTotal();
  }, [watch('discount'), coffinFee, tombstoneFee, crossFee, storageFee]);

  //submit data to the database

  const onSubmit = async (data: ArrangementFormValues) => {
    if (!deceasedId) {
      form.setError('deceased', { message: 'Deceased ID is required' });
      throw error;
    }

    let deceasedDate = deceasedData?.find((c) => c.id === deceasedId);

    calculateTotal;

    data.deceased = deceasedId;
    data.totalDue = amountDue;

    //this checks whether payments were made on arrangement before any other changes were made

    if (paymentsMade !== 0) {
      data.outstandingBalance = amountDue - paymentsMade;
      data.paidUp = false;
    } else {
      data.outstandingBalance = amountDue;
    }

    data.storage = storageFee;

    if (deceasedDate) {
      data.storageDays = calculate_storageDays(
        new Date(deceasedDate.removalDate),
        new Date(form.getValues().dateOfFuneralService)
      );
    }

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
      form.reset();
      arrangementModal.onClose();

      router.back();
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
    setAmountDue(0);
    form.reset();

    router.push('/arrangements');
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (initialData && deceasedId) {
      setValue('deceased', initialData.deceased.id);

      if (initialData.dateOfFuneralService) {
        setValue(
          'dateOfFuneralService',
          new Date(initialData.dateOfFuneralService)
        );
      }
      setValue('paidUp', initialData.paidUp);
      setValue('additionalItems', initialData.additionalItems);
      setValue('discount', initialData.discount);
      setValue('bus', initialData.bus);
      setValue('graveNo', initialData.graveNo);
      setValue('digger', initialData.digger);

      if (initialData.cross) {
        setValue('crossSizeId', initialData.cross.id);
      }

      setValue('arrangementAddOnItems', initialData.arrangementAddOnItems);

      if (initialData.grave) setValue('graveId', initialData.grave.id);
      if (initialData.graveTime) setValue('graveTime', initialData.graveTime);

      if (initialData.church) setValue('church', initialData.church);
      if (initialData.familyReps)
        setValue('familyReps', initialData.familyReps);
      if (initialData.coffinId) setValue('coffinId', initialData.coffinId);
      if (initialData.coffinId)
        setValue('tombstoneId', initialData.tombstone.id);

      if (initialData.minister) setValue('minister', initialData.minister);

      setValue('notes', initialData.notes);

      if (initialData.storage) setValue('storage', initialData.storage);
      if (initialData.storageDays)
        setValue('storageDays', initialData.storageDays);

      if (initialData.crossSize) setValue('crossSize', initialData.crossSize);
      if (initialData.decor) setValue('decor', initialData.decor);

      setPaymentsMade(
        initialData.receipts.reduce((total, deceased) => {
          return total + deceased.receivedAmount;
        }, 0)
      );
    }
  }, [deceasedId, initialData]);

  useEffect(() => {
    if (!deceasedId && !initialData && addOnData) {
      const addOnsArray: ArrangementAddOnItem[] = addOnData.map((addon) => ({
        name: addon.name,
        price: addon.price,
        qty: 0,
      }));

      addOnReplace(addOnsArray);
    }

    if (deceasedId && initialData) {
      addOnReplace(initialData.arrangementAddOnItems);
    }
  }, [initialData, addOnData, deceasedId]);

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
      <hr className="w-full mb-5" />
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
          ) : initialData ? (
            <p className="text-xl font-medium">
              {initialData.deceased.firstNames +
                ' ' +
                initialData.deceased.lastName}
            </p>
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
                    email: '',
                  })
                }
              />
            </div>

            <hr className="w-full my-4" />
            <div className="grid grid-cols-[auto, auto, auto, auto,auto, 40px] w-full gap-2">
              <h2 className="col-start-1 font-semibold">Surname</h2>
              <h2 className="col-start-2 font-semibold">First Name</h2>
              <h2 className="col-start-3 font-semibold">Relationship</h2>
              <h2 className="col-start-4 font-semibold">Phone No.</h2>
              <h2 className="col-start-5 font-semibold">Email</h2>
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
                        placeholder="Brother"
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
                  <FormItem className={cn('w-full  col-start-5')}>
                    <FormControl>
                      <Input
                        key={field.id} // important to include key with field's id
                        {...register(`familyReps.${index}.email` as const)}
                        placeholder="Email"
                      />
                    </FormControl>
                  </FormItem>
                  <X
                    className="h-6 w-6 col-start-6 justify-self-end text-background rounded-full shadow-sm bg-red-800"
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
                <hr className="w-full my-3" />

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
                <hr className="w-full my-5" />

                <div className="flex flex-col w-full gap-y-2 ">
                  <h2 className="text-lg mb-2 font-semibold">Cemetry</h2>
                  <FormField
                    control={form.control}
                    name="graveId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Cemetry</FormLabel>
                        {gravesLoading ? (
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
                                  placeholder="Select Cemetry"
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {graves.map((grave) => (
                                <SelectItem value={grave.id} key={grave.id}>
                                  {grave.graveName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="graveTime"
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
                  <FormField
                    control={form.control}
                    name="graveNo"
                    render={({ field }) => (
                      <FormItem className=" w-1/2 mb-5 flex flex-col items-baseline gap-x-2">
                        <FormLabel className="font-semibold">
                          Grave No
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Grave No" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <hr className="w-full my-5" />

                <div className="flex flex-col gap-y-2 mt-2">
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
                            Surname
                          </FormLabel>
                          <FormControl>
                            <Input
                              disabled={loading}
                              placeholder="Surname"
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
                    name="coffinId"
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
                                  {coffin.coffinName} -{' '}
                                  {formatter.format(coffin.price)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="crossSizeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">
                          Cross Size
                        </FormLabel>
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
                                  placeholder="Select Cross Size"
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {crosses.map((crosses) => (
                                <SelectItem value={crosses.id} key={crosses.id}>
                                  {crosses.size} -{' '}
                                  {formatter.format(crosses.price)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </FormItem>
                    )}
                  />
                </div>
                <hr className="w-full" />
                <div className="flex flex-col w-full gap-y-2">
                  <div className="flex flex-col w-full gap-y-2">
                    <h2 className="text-lg  font-semibold">Extras</h2>
                    <div className="p-2 border rounded-md">
                      <FormLabel className="mb-2">Digger</FormLabel>
                      <div className="flex flex-row w-full">
                        <FormField
                          control={form.control}
                          name="digger.qty"
                          render={({ field }) => (
                            <FormItem className="flex flex-row gap-x-2 w-full items-center">
                              <FormLabel>Qty</FormLabel>
                              <FormControl>
                                <Input
                                  disabled={loading}
                                  placeholder="qty"
                                  {...field}
                                  className="w-1/2"
                                  type="number"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="digger.price"
                          render={({ field }) => (
                            <FormItem className="flex flex-row gap-x-2 items-center w-full">
                              <FormLabel>Unit Price</FormLabel>

                              <FormControl>
                                <Input
                                  disabled={loading}
                                  placeholder="price"
                                  {...field}
                                  className="w-2/3"
                                  type="number"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="p-2 border rounded-md">
                      <FormLabel className="mb-2">Bus</FormLabel>
                      <div className="flex flex-row w-full">
                        <FormField
                          control={form.control}
                          name="bus.qty"
                          render={({ field }) => (
                            <FormItem className="flex flex-row gap-x-2 w-full items-center">
                              <FormLabel>Qty</FormLabel>
                              <FormControl>
                                <Input
                                  disabled={loading}
                                  placeholder="qty"
                                  {...field}
                                  className="w-1/2"
                                  type="number"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="bus.price"
                          render={({ field }) => (
                            <FormItem className="flex flex-row gap-x-2 items-center w-full">
                              <FormLabel>Unit Price</FormLabel>

                              <FormControl>
                                <Input
                                  disabled={loading}
                                  placeholder="price"
                                  {...field}
                                  className="w-2/3"
                                  type="number"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <hr className="w-full my-2" />

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
                                    {tombstone.type}({tombstone.tombstoneName})
                                    - {formatter.format(tombstone.price)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </FormItem>
                      )}
                    />
                  </div>
                  <hr className="w-full my-3" />

                  <div className="flex flex-col gap-y-2">
                    <h2 className="text-lg mb-2 font-semibold">Decor</h2>

                    <div className="flex flex-col items-start space-y-0 rounded-md border p-2 w-full">
                      <FormLabel className="mb-2">Glass</FormLabel>
                      <div className="flex flex-row w-full">
                        <FormField
                          control={form.control}
                          name="decor.glass.qty"
                          render={({ field }) => (
                            <FormItem className="flex flex-row gap-x-2 w-full items-center">
                              <FormLabel>Qty</FormLabel>
                              <FormControl>
                                <Input
                                  disabled={loading}
                                  placeholder="qty"
                                  {...field}
                                  className="w-1/2"
                                  type="number"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="decor.glass.price"
                          render={({ field }) => (
                            <FormItem className="flex flex-row gap-x-2 items-center w-full">
                              <FormLabel>Unit Price</FormLabel>

                              <FormControl>
                                <Input
                                  disabled={loading}
                                  placeholder="price"
                                  {...field}
                                  className="w-2/3"
                                  type="number"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col items-start space-y-0 rounded-md border p-2 w-full">
                      <FormLabel className="mb-2">Banner</FormLabel>
                      <div className="flex flex-row w-full">
                        <FormField
                          control={form.control}
                          name="decor.banner.qty"
                          render={({ field }) => (
                            <FormItem className="flex flex-row gap-x-2 w-full items-center">
                              <FormLabel>Qty</FormLabel>
                              <FormControl>
                                <Input
                                  disabled={loading}
                                  placeholder="qty"
                                  {...field}
                                  className="w-1/2"
                                  type="number"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="decor.banner.price"
                          render={({ field }) => (
                            <FormItem className="flex flex-row gap-x-2 items-center w-full">
                              <FormLabel>Unit Price</FormLabel>

                              <FormControl>
                                <Input
                                  disabled={loading}
                                  placeholder="price"
                                  {...field}
                                  className="w-2/3"
                                  type="number"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col items-start space-y-0 rounded-md border p-2 w-full">
                      <FormLabel className="mb-2">Candle</FormLabel>
                      <div className="flex flex-row w-full">
                        <FormField
                          control={form.control}
                          name="decor.candle.qty"
                          render={({ field }) => (
                            <FormItem className="flex flex-row gap-x-2 w-full items-center">
                              <FormLabel>Qty</FormLabel>
                              <FormControl>
                                <Input
                                  disabled={loading}
                                  placeholder="qty"
                                  {...field}
                                  className="w-1/2"
                                  type="number"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="decor.candle.price"
                          render={({ field }) => (
                            <FormItem className="flex flex-row gap-x-2 items-center w-full">
                              <FormLabel>Unit Price</FormLabel>

                              <FormControl>
                                <Input
                                  disabled={loading}
                                  placeholder="price"
                                  {...field}
                                  className="w-2/3"
                                  type="number"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col items-start space-y-0 rounded-md border p-2 w-full">
                      <FormLabel className="mb-2">Photo</FormLabel>
                      <div className="flex flex-row w-full">
                        <FormField
                          control={form.control}
                          name="decor.photo.qty"
                          render={({ field }) => (
                            <FormItem className="flex flex-row gap-x-2 w-full items-center">
                              <FormLabel>Qty</FormLabel>
                              <FormControl>
                                <Input
                                  disabled={loading}
                                  placeholder="qty"
                                  {...field}
                                  className="w-1/2"
                                  type="number"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="decor.photo.price"
                          render={({ field }) => (
                            <FormItem className="flex flex-row gap-x-2 items-center w-full">
                              <FormLabel> Unit Price</FormLabel>

                              <FormControl>
                                <Input
                                  disabled={loading}
                                  placeholder="price"
                                  {...field}
                                  className="w-2/3"
                                  type="number"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-2 mt-10">
                    <div className="flex justify-between">
                      <h2 className="text-lg mb-2 font-semibold">
                        Additional Items
                      </h2>

                      <Plus
                        className="h-8 w-8"
                        onClick={() =>
                          additionalItemsAppend({
                            description: '',
                            amount: 0,
                          })
                        }
                      />
                    </div>

                    <div className="grid grid-cols-[auto auto 40px] w-full gap-2">
                      {additionalFields.map((field, index) => (
                        <div
                          className="col-span-3 grid grid-cols-[auto auto 40px] w-full gap-2 items-center"
                          key={field.id}
                        >
                          <FormItem className={cn('w-full col-start-1')}>
                            <FormControl>
                              <Input
                                key={field.id} // important to include key with field's id
                                {...register(
                                  `additionalItems.${index}.description` as const
                                )}
                                placeholder="Description"
                              />
                            </FormControl>
                          </FormItem>
                          <FormItem className={cn('w-full  col-start-2')}>
                            <FormControl>
                              <Input
                                key={field.id} // important to include key with field's id
                                {...register(
                                  `additionalItems.${index}.amount` as const
                                )}
                                placeholder="Price"
                              />
                            </FormControl>
                          </FormItem>
                          <X
                            className="h-5 w-5 col-start-3 justify-self-end bg-red-900 rounded-full text-background "
                            onClick={() => additionalItemsRemove(index)}
                          />
                        </div>
                      ))}
                    </div>
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
              {addOnFields?.map((field, index) => (
                <div
                  className="grid grid-cols-3 w-full gap-2 items-center"
                  key={field.id}
                >
                  <FormLabel className="col-start-1">{field.name}</FormLabel>

                  <FormItem className={cn('w-full  col-start-2')}>
                    <FormControl>
                      <Input
                        key={field.id} // important to include key with field's id
                        {...register(
                          `arrangementAddOnItems.${index}.qty` as const
                        )}
                        placeholder="qty"
                      />
                    </FormControl>
                  </FormItem>

                  <FormLabel className="col-start-3">
                    @ {formatter.format(field.price)}/each
                  </FormLabel>
                </div>
              ))}
            </div>
          </section>

          <section className="flex flex-col mt-10 w-full  text-right">
            <h1 className="text-xl font-semibold">Summary</h1>
            <hr className="w-full my-4" />
            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem className=" mb-5 flex items-baseline gap-x-2 justify-end">
                  <h2 className="text-xl mr-2">
                    Discount: <span className="font-semibold">R</span>{' '}
                  </h2>
                  <FormControl>
                    <Input
                      placeholder="400"
                      {...field}
                      className="w-40"
                      type="number"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="w-full flex flex-row justify-end items-center">
              <h2 className="text-xl mr-2">Total Payable: </h2>
              <h1 className="text-xl font-semibold text-end">
                {form.getValues().dateOfFuneralService ? (
                  amountDue !== 0 ? (
                    <div className="flex flex-row gap-2 items-center">
                      {formatter.format(amountDue)}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <RefreshCcw
                              className="h-5 w-5 hover:cursor-pointer"
                              onClick={calculateTotal}
                            />
                          </TooltipTrigger>
                          <TooltipContent side="left">
                            <p>Update Total</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ) : (
                    <button
                      className=" text-sm text-background bg-primary p-1 hover:cursor-pointer rounded-sm shadow-md"
                      onClick={calculateTotal}
                    >
                      Calculate Total
                    </button>
                  )
                ) : (
                  'Please specify date of funeral'
                )}{' '}
              </h1>
            </div>

            <hr className="w-full my-4" />
          </section>

          <section className="flex w-full gap-x-2 justify-end">
            <Button
              type="submit"
              className="w-48 font-semibold"
              disabled={
                deceasedId === null ||
                loading ||
                form.getValues().dateOfFuneralService == null ||
                amountDue == 0
              }
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
