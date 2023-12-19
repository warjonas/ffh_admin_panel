'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
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
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { signal } from '@preact/signals';
import { Eye } from 'lucide-react';
import { EyeOff } from 'lucide-react';

type Props = {};

const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters',
  }),
  password: z.string().min(8),
});

const Login = (props: Props) => {
  const [viewPassword, setViewPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div className="flex justify-center min-h-screen items-center">
      <div className="bg-secondary bg-opacity-20 shadow-lg rounded-lg p-5 w-full md:w-1/2 xl:w-1/4 border border-secondary-foreground text-center self-center items-center mx-auto">
        {' '}
        <h1 className={cn('font-sans text-4xl mb-5')}>Sign In</h1>
        <section className="w-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="text-left flex flex-col gap-y-4"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="username" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between">
                      <FormLabel>Password</FormLabel>
                      {viewPassword ? (
                        <EyeOff
                          onClick={() => setViewPassword(!viewPassword)}
                          className="hover:cursor-pointer"
                        />
                      ) : (
                        <Eye
                          onClick={() => setViewPassword(!viewPassword)}
                          className="hover:cursor-pointer"
                        />
                      )}
                    </div>

                    <FormControl>
                      <Input
                        {...field}
                        type={viewPassword ? 'text' : 'password'}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </section>
      </div>
    </div>
  );
};

export default Login;
