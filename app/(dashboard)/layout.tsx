import { getSession } from '@auth0/nextjs-auth0';
import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin';
import { redirect } from 'next/navigation';

import React, { Suspense } from 'react';
import { extractRouterConfig } from 'uploadthing/server';
import { ourFileRouter } from '../api/uploadthing/core';
import Navbar from '@/components/navbar';
import Image from 'next/image';
import { ModalProvider } from '@/providers/modal-provider';
import Loading from './Loading';

interface Props {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: Props) {
  const session = await getSession();

  if (!session) {
    redirect('/api/auth/login');
  }

  return (
    <main className="flex flex-col h-[80%] xl:h-full w-full overflow-auto relative">
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
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </main>
  );
}
