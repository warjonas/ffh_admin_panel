'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { LogOutIcon } from 'lucide-react';
import React from 'react';
import { Button } from './ui/button';
import { redirect } from 'next/dist/server/api-utils';
import { useRouter } from 'next/navigation';

type Props = {};

const SidebarFooter = (props: Props) => {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>{error.message}</div>;

  return (
    user && (
      <>
        <div className="mb-5 hidden lg:block">
          <h1 className="font-semibold text-lg mb-2">Signed In as:</h1>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
        <div className="w-full">
          <a href="/api/auth/logout">
            <Button className="w-full justify-between p-2 text-xl">
              <span className="lg:block hidden">Logout</span>
              <span>
                <LogOutIcon className="h-5 w-5" />
              </span>
            </Button>
          </a>
        </div>
      </>
    )
  );
};

export default SidebarFooter;
