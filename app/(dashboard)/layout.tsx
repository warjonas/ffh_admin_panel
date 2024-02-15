import { getSession } from '@auth0/nextjs-auth0';
import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin';
import { redirect } from 'next/navigation';

import React from 'react';
import { extractRouterConfig } from 'uploadthing/server';
import { ourFileRouter } from '../api/uploadthing/core';
import Navbar from '@/components/navbar';
import Image from 'next/image';
import { ModalProvider } from '@/providers/modal-provider';

interface Props {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: Props) {
  const session = await getSession();

  if (!session) {
    redirect('/api/auth/login');
  }

  return (
    <main className="flex flex-col w-full">
      <Navbar />
      {/* <Sidebar /> */}
      <NextSSRPlugin
        /**
         * The `extractRouterConfig` will extract **only** the route configs
         * from the router to prevent additional information from being
         * leaked to the client. The data passed to the client is the same
         * as if you were to fetch `/api/uploadthing` directly.
         */
        routerConfig={extractRouterConfig(ourFileRouter)}
      />
      <ModalProvider />

      {children}
      <footer className="w-full flex justify-end p-2">
        <Image
          src="https://i.ibb.co/G9z3n0M/Logo-color-alt.png"
          height={1080}
          width={1920}
          alt="logo"
          className="h-10 w-48"
        />
      </footer>
    </main>
  );
}
