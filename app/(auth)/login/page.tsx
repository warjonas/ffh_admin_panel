'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import LoginForm from './components/loginForm';

type Props = {};

const Login = (props: Props) => {
  const [viewPassword, setViewPassword] = useState(false);

  return (
    <div className="flex justify-center min-h-screen items-center w-full px-10 md:px-2 ">
      <div className="bg-secondary bg-opacity-20 shadow-lg rounded-lg p-5 w-full md:w-2/3 xl:w-1/4 border border-secondary-foreground text-center self-center items-center mx-auto">
        {' '}
        <h1 className={cn('font-sans text-4xl mb-5')}>Sign In</h1>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
