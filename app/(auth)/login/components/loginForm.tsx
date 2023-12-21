'use client';

import React, { useEffect, useState } from 'react';
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
import { Eye, EyeOff } from 'lucide-react';

const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters',
  }),
  password: z.string().min(8),
});

type SignInFormValues = z.infer<typeof formSchema>;

const LoginForm = () => {
  const [viewPassword, setViewPassword] = useState(false);

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  async function onSubmit(values: SignInFormValues) {
    console.log(values);

    try {
      // await signIn()
    } catch (error) {}
  }

  return (
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
                  <Input {...field} type={viewPassword ? 'text' : 'password'} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </section>
  );
};

export default LoginForm;
