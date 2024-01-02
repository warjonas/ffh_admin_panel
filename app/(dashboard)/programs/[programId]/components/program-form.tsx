'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
import { useUser } from '@auth0/nextjs-auth0/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { FuneralProgram } from '@prisma/client';
import axios from 'axios';
import { CalendarIcon, Plus, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import * as z from 'zod';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { UploadButton } from '@/lib/uploadthing';

interface ProgramFormProps {
  initialData: FuneralProgram | null;
}

const formSchema = z.object({
  languageOfProgram: z.string().min(1),
  firstNameOfDeceased: z.string().min(1),
  nickName: z.string().min(1),
  lastNameOfDeceased: z.string().min(1),
  dateOfBirth: z.date({
    required_error: 'Date of Birth is required',
  }),
  dateOfDeath: z.date({
    required_error: 'Date of death is required',
  }),
  survivedBy: z.string().min(1),
  atHome: z.object({
    officiatingMinister: z
      .string({ required_error: 'Officiating Minister is requiired' })
      .min(1),
  }),
  atChurch: z.object({
    officiatingMinister: z
      .string({ required_error: 'Officiating Minister is requiired' })
      .min(1),
    orbituary: z.string().min(1),
    voteOfThanks: z.string().min(1),
    otherItems: z.string().min(1),
  }),
  hymn: z.object({
    nameOfHymnBook: z.string().min(1),
    hymns: z
      .object({
        hymnNumber: z.coerce.number(),
        detailsOfHymn: z.string().min(1),
      })
      .array(),
  }),

  pallbearersInHouse: z
    .object({
      firstName: z.string().min(1),
      lastName: z.string().min(1),
    })
    .array()
    .min(2),
  pallbearersOutHouse: z
    .object({
      firstName: z.string().min(1),
      lastName: z.string().min(1),
    })
    .array()
    .min(2),
  pallbearersInChurch: z
    .object({
      firstName: z.string().min(1),
      lastName: z.string().min(1),
    })
    .array()
    .min(2),
  pallbearersOutChurch: z
    .object({
      firstName: z.string().min(1),
      lastName: z.string().min(1),
    })
    .array()
    .min(2),
  pallbearersGrave: z
    .object({
      firstName: z.string().min(1),
      lastName: z.string().min(1),
    })
    .array()
    .min(2),
  orbituaryText: z.string().default(''),
  createdBy: z.string(),
  needPallbearers: z.boolean().default(true),
  otherInformation: z.string(),
});

type ProgramFormValues = z.infer<typeof formSchema>;

const ProgramForm = ({ initialData }: ProgramFormProps) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { user, error, isLoading } = useUser();

  const title = initialData
    ? `Edit Funeral Program for ${initialData.firstNameOfDeceased} ${initialData.lastNameOfDeceased}`
    : 'Funeral Program';
  const description = initialData
    ? 'Make changes to existing funeral program.'
    : 'Create a new funeral program';
  const toastMessage = initialData
    ? 'Changes successfully applied.'
    : 'Funeral Program created successfully';
  const action = initialData ? 'Save changes' : 'Add Funeral Program';

  const form = useForm<ProgramFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
        }
      : {
          languageOfProgram: '',
          atChurch: {
            orbituary: '',
            officiatingMinister: '',
            otherItems: '',
            voteOfThanks: '',
          },
          atHome: {
            officiatingMinister: '',
          },
          hymn: {
            nameOfHymnBook: '',
            hymns: [
              {
                detailsOfHymn: '',
              },
            ],
          },
          nickName: '',

          firstNameOfDeceased: '',
          lastNameOfDeceased: '',
          orbituaryText: 'None',
          pallbearersGrave: [
            {
              firstName: '',
              lastName: '',
            },
          ],
          pallbearersInChurch: [
            {
              firstName: '',
              lastName: '',
            },
          ],
          pallbearersInHouse: [
            {
              firstName: '',
              lastName: '',
            },
          ],
          pallbearersOutChurch: [
            {
              firstName: '',
              lastName: '',
            },
          ],
          pallbearersOutHouse: [
            {
              firstName: '',
              lastName: '',
            },
          ],
          survivedBy: '',
          createdBy: 'email',
          needPallbearers: false,
          otherInformation: '',
        },
  });

  const {
    control,
    handleSubmit,
    register,

    formState: { errors },
  } = form;

  const {
    fields: hymsFields,
    append: hymsAppend,

    remove: hymsRemove,
  } = useFieldArray({
    control,
    name: 'hymn.hymns',
    rules: {
      minLength: 1,
    },
  });

  const {
    fields: pallbearersGraveFields,
    append: pallbearersGraveAppend,

    remove: pallbearersGraveRemove,
  } = useFieldArray({
    control,
    name: 'pallbearersGrave',
    rules: {
      minLength: 1,
    },
  });

  const {
    fields: pallbearersInChurchFields,
    append: pallbearersInChurchAppend,

    remove: pallbearersInChurchRemove,
  } = useFieldArray({
    control,
    name: 'pallbearersInChurch',
    rules: {
      minLength: 1,
    },
  });

  const {
    fields: pallbearersOutChurchFields,
    append: pallbearersOutChurchAppend,

    remove: pallbearersOutChurchRemove,
  } = useFieldArray({
    control,
    name: 'pallbearersOutChurch',
    rules: {
      minLength: 1,
    },
  });

  const {
    fields: pallbearersInHouseFields,
    append: pallbearersInHouseAppend,

    remove: pallbearersInHouseRemove,
  } = useFieldArray({
    control,
    name: 'pallbearersInHouse',
    rules: {
      minLength: 1,
    },
  });

  const {
    fields: pallbearersOutHouseFields,
    append: pallbearersOutHouseAppend,

    remove: pallbearersOutHouseRemove,
  } = useFieldArray({
    control,
    name: 'pallbearersOutHouse',
    rules: {
      minLength: 1,
    },
  });

  const onSubmit = async (data: ProgramFormValues) => {
    try {
      setLoading(true);
      console.log('user info', data);

      if (!error || !isLoading) {
        if (user?.email) {
          data.createdBy = user.email;
        }
      }

      if (initialData) {
        await axios.patch(`/api/program/${initialData.id}`, data);
      } else {
        await axios.post('/api/program', data);
      }
      router.push('/programs');
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
        <form
          onSubmit={handleSubmit(onSubmit)}
          className=" mb-20 flex flex-col xl:flex-row gap-x-8 "
        >
          <div className="flex flex-col w-full xl:w-1/2 gap-y-3">
            <FormField
              control={form.control}
              name="languageOfProgram"
              render={({ field }) => (
                <FormItem className=" w-full md:w-1/2 xl:w-1/2">
                  <FormLabel className="font-semibold">
                    Language of Program
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="English"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="w-full flex flex-row gap-x-5">
              <FormField
                control={form.control}
                name="firstNameOfDeceased"
                render={({ field }) => (
                  <FormItem className=" w-full md:w-1/2 xl:w-1/2">
                    <FormLabel className="font-semibold">
                      First name of Deceased
                    </FormLabel>
                    <FormControl>
                      <Input disabled={loading} placeholder="John" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nickName"
                render={({ field }) => (
                  <FormItem className=" w-full md:w-1/2 xl:w-1/2">
                    <FormLabel className="font-semibold">Nickname</FormLabel>
                    <FormControl>
                      <Input disabled={loading} placeholder="Joey" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastNameOfDeceased"
                render={({ field }) => (
                  <FormItem className=" w-full md:w-1/2 xl:w-1/2">
                    <FormLabel className="font-semibold">
                      Last Name of Deceased
                    </FormLabel>
                    <FormControl>
                      <Input disabled={loading} placeholder="Doe" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-row gap-x-3 items-center mt-2 w-full">
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-1/2">
                    <FormLabel>Date of Birth:*</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild className="">
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
              -
              <FormField
                control={form.control}
                name="dateOfDeath"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-1/2">
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
                          disabled={(date) =>
                            date < new Date(form.getValues().dateOfBirth) ||
                            date > new Date()
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="survivedBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>The deceased is survived by:</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List of survivors"
                      className="resize-y max-h-44"
                      {...field}
                      // maxLength={190}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide the list of survivors separated by a comma (,)
                  </FormDescription>
                </FormItem>
              )}
            />
            <hr className="w-1/2" />
            <h1 className="font-semibold text-xl">Service at Home</h1>
            <FormField
              control={form.control}
              name="atHome.officiatingMinister"
              render={({ field }) => (
                <FormItem className="flex w-full items-center">
                  <FormLabel className="font-semibold leading-6 w-fit">
                    Officiating Minister
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Rev Jacobs"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <h1 className="font-semibold text-xl">Service at Church</h1>
            <FormField
              control={form.control}
              name="atChurch.officiatingMinister"
              render={({ field }) => (
                <FormItem className="flex w-full md:w-1/2 xl:w-1/2 items-center">
                  <FormLabel className="font-semibold w-1/3 leading-6">
                    Officiating Minister
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Rev Jacobs"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="atChurch.orbituary"
              render={({ field }) => (
                <FormItem className="flex w-full md:w-1/2 xl:w-1/2 items-center">
                  <FormLabel className="font-semibold w-1/3">
                    Orbituary
                  </FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Paul" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="atChurch.voteOfThanks"
              render={({ field }) => (
                <FormItem className="flex w-full md:w-1/2 xl:w-1/2 items-center">
                  <FormLabel className="font-semibold w-1/3">
                    Vote Of Thanks
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Richard"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="atChurch.otherItems"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Other Speakers/items:</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Poem by Tyler"
                      className="resize-y max-h-44"
                      {...field}
                      // maxLength={190}
                    />
                  </FormControl>
                  <FormDescription>
                    Other items such as slide shows, family friend message,
                    poem, etc.
                  </FormDescription>
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 w-full gap-2">
              <h1 className="font-semibold text-xl row-start-1 mt-5">Hymns</h1>
              <div className="col-span-2 row-start-2">
                <div className="flex w-full justify-between">
                  <FormField
                    control={form.control}
                    name="hymn.nameOfHymnBook"
                    render={({ field }) => (
                      <FormItem className="flex w-full md:w-1/2 xl:w-1/2 items-center">
                        <FormLabel className="font-semibold w-1/2">
                          Name of Hymn Book
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder="Psalms"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Plus
                    className="h-8 w-8"
                    onClick={() =>
                      hymsAppend({
                        hymnNumber: 0,
                        detailsOfHymn: '',
                      })
                    }
                  />
                </div>
                <hr className=" w-full col-span-2 my-2" />
              </div>

              <h2 className="col-start-1 font-semibold">Hymn Number</h2>
              <h2 className="col-start-2 font-semibold">
                Brief Details of hymn
              </h2>

              {hymsFields.map((field, index) => (
                <>
                  <FormItem className={cn('w-1/3  col-start-1')}>
                    <FormControl>
                      <Input
                        key={field.id} // important to include key with field's id
                        {...register(`hymn.hymns.${index}.hymnNumber` as const)}
                        placeholder="104"
                        type="number"
                      />
                    </FormControl>
                  </FormItem>
                  <FormItem className={cn('w-full  col-start-2')}>
                    <FormControl>
                      <Input
                        key={field.id} // important to include key with field's id
                        {...register(
                          `hymn.hymns.${index}.detailsOfHymn` as const
                        )}
                        placeholder="Details"
                      />
                    </FormControl>
                  </FormItem>

                  <Trash
                    className="h-8 w-8 col-start-5 justify-self-end "
                    onClick={() => hymsRemove(index)}
                  />
                </>
              ))}
            </div>
          </div>
          <div className="w-full xl:w-1/2 flex flex-col mt-5">
            <FormField
              control={form.control}
              name="otherInformation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Any other information:</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Poem by Tyler"
                      className="resize-y max-h-44"
                      {...field}
                      // maxLength={190}
                    />
                  </FormControl>
                  <FormDescription>
                    Other items such as slide shows, family friend message,
                    poem, etc.
                  </FormDescription>
                </FormItem>
              )}
            />
            <hr className="w-full my-5" />
            <FormField
              control={form.control}
              name="needPallbearers"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Pallbearers</FormLabel>
                    <FormDescription>
                      If you prefer to specify pallbearers
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {form.watch().needPallbearers ? (
              <>
                <h1 className="mt-2 text-xl font-semibold">Pallbearers</h1>
                <div className="flex flex-row w-full">
                  <div className="w-1/2 flex flex-col pr-4 gap-y-2">
                    <div className="flex flex-row justify-between text-lg">
                      <h2>Into House</h2>
                      <Plus
                        className="h-5 w-5"
                        onClick={() =>
                          pallbearersInHouseAppend({
                            firstName: '',
                            lastName: '',
                          })
                        }
                      />
                    </div>
                    {pallbearersInHouseFields.map((field, index) => (
                      <div className="flex gap-x-4">
                        <FormItem className={cn('w-full')}>
                          <FormControl>
                            <Input
                              key={field.id} // important to include key with field's id
                              {...register(
                                `pallbearersInHouse.${index}.firstName` as const
                              )}
                              placeholder="First name"
                            />
                          </FormControl>
                        </FormItem>
                        <FormItem className={cn('w-full  col-start-2')}>
                          <FormControl>
                            <Input
                              key={field.id} // important to include key with field's id
                              {...register(
                                `pallbearersInHouse.${index}.lastName` as const
                              )}
                              placeholder="Last name"
                            />
                          </FormControl>
                        </FormItem>

                        <Trash
                          className="h-8 w-8 col-start-5 justify-self-end "
                          onClick={() => pallbearersInHouseRemove(index)}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="w-1/2 flex flex-col gap-y-2">
                    <div className="flex flex-row justify-between text-lg ">
                      <h2>Out of House</h2>
                      <Plus
                        className="h-5 w-5"
                        onClick={() =>
                          pallbearersOutHouseAppend({
                            firstName: '',
                            lastName: '',
                          })
                        }
                      />
                    </div>
                    {pallbearersOutHouseFields.map((field, index) => (
                      <div className="flex gap-x-4">
                        <FormItem className={cn('w-full')}>
                          <FormControl>
                            <Input
                              key={field.id} // important to include key with field's id
                              {...register(
                                `pallbearersOutHouse.${index}.firstName` as const
                              )}
                              placeholder="First name"
                            />
                          </FormControl>
                        </FormItem>
                        <FormItem className={cn('w-full  col-start-2')}>
                          <FormControl>
                            <Input
                              key={field.id} // important to include key with field's id
                              {...register(
                                `pallbearersOutHouse.${index}.lastName` as const
                              )}
                              placeholder="Last name"
                            />
                          </FormControl>
                        </FormItem>

                        <Trash
                          className="h-8 w-8 col-start-5 justify-self-end "
                          onClick={() => pallbearersOutHouseRemove(index)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="w-full flex flex-row  gap-y-2 mt-10">
                  <div className="w-1/2 flex flex-col gap-y-2 pr-4">
                    <div className="flex flex-row justify-between text-lg ">
                      <h2>Into Church</h2>
                      <Plus
                        className="h-5 w-5"
                        onClick={() =>
                          pallbearersInChurchAppend({
                            firstName: '',
                            lastName: '',
                          })
                        }
                      />
                    </div>
                    {pallbearersInChurchFields.map((field, index) => (
                      <div className="flex gap-x-4">
                        <FormItem className={cn('w-full')}>
                          <FormControl>
                            <Input
                              key={field.id} // important to include key with field's id
                              {...register(
                                `pallbearersInChurch.${index}.firstName` as const
                              )}
                              placeholder="First name"
                            />
                          </FormControl>
                        </FormItem>
                        <FormItem className={cn('w-full  col-start-2')}>
                          <FormControl>
                            <Input
                              key={field.id} // important to include key with field's id
                              {...register(
                                `pallbearersInChurch.${index}.lastName` as const
                              )}
                              placeholder="Last name"
                            />
                          </FormControl>
                        </FormItem>

                        <Trash
                          className="h-8 w-8 col-start-5 justify-self-end "
                          onClick={() => pallbearersInChurchRemove(index)}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="w-1/2 flex flex-col gap-y-2">
                    <div className="flex flex-row justify-between text-lg ">
                      <h2>Out of Church</h2>
                      <Plus
                        className="h-5 w-5"
                        onClick={() =>
                          pallbearersOutChurchAppend({
                            firstName: '',
                            lastName: '',
                          })
                        }
                      />
                    </div>
                    {pallbearersOutChurchFields.map((field, index) => (
                      <div className="flex gap-x-4">
                        <FormItem className={cn('w-full')}>
                          <FormControl>
                            <Input
                              key={field.id} // important to include key with field's id
                              {...register(
                                `pallbearersOutChurch.${index}.firstName` as const
                              )}
                              placeholder="First name"
                            />
                          </FormControl>
                        </FormItem>
                        <FormItem className={cn('w-full  col-start-2')}>
                          <FormControl>
                            <Input
                              key={field.id} // important to include key with field's id
                              {...register(
                                `pallbearersOutChurch.${index}.lastName` as const
                              )}
                              placeholder="Last name"
                            />
                          </FormControl>
                        </FormItem>

                        <Trash
                          className="h-8 w-8 col-start-5 justify-self-end "
                          onClick={() => pallbearersOutChurchRemove(index)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="w-1/2 flex flex-col gap-y-2 pr-4 mt-10">
                  <div className="flex flex-row justify-between text-lg ">
                    <h2>At the Grave</h2>
                    <Plus
                      className="h-5 w-5"
                      onClick={() =>
                        pallbearersGraveAppend({
                          firstName: '',
                          lastName: '',
                        })
                      }
                    />
                  </div>
                  {pallbearersGraveFields.map((field, index) => (
                    <div className="flex gap-x-4">
                      <FormItem className={cn('w-full')}>
                        <FormControl>
                          <Input
                            key={field.id} // important to include key with field's id
                            {...register(
                              `pallbearersGrave.${index}.firstName` as const
                            )}
                            placeholder="First name"
                          />
                        </FormControl>
                      </FormItem>
                      <FormItem className={cn('w-full  col-start-2')}>
                        <FormControl>
                          <Input
                            key={field.id} // important to include key with field's id
                            {...register(
                              `pallbearersGrave.${index}.lastName` as const
                            )}
                            placeholder="Last name"
                          />
                        </FormControl>
                      </FormItem>

                      <Trash
                        className="h-8 w-8 col-start-5 justify-self-end "
                        onClick={() => pallbearersGraveRemove(index)}
                      />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                {' '}
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    // Do something with the response
                    console.log('Files: ', res);
                    alert('Upload Completed');
                  }}
                  onUploadError={(error: Error) => {
                    // Do something with the error.
                    alert(`ERROR! ${error.message}`);
                  }}
                />
              </>
            )}
          </div>
          <p className="text-black">{form.formState.isValid}</p>
          <Button type="submit" className="my-10">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default ProgramForm;
