import Sidebar from '@/components/sidebar';
import { getSession } from '@auth0/nextjs-auth0';
import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin';
import { redirect } from 'next/navigation';

import React from 'react';
import { extractRouterConfig } from 'uploadthing/server';
import { ourFileRouter } from '../api/uploadthing/core';

interface Props {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: Props) {
  const session = await getSession();

  if (!session) {
    redirect('/api/auth/login');
  }

  return (
    <>
      <Sidebar />
      <NextSSRPlugin
        /**
         * The `extractRouterConfig` will extract **only** the route configs
         * from the router to prevent additional information from being
         * leaked to the client. The data passed to the client is the same
         * as if you were to fetch `/api/uploadthing` directly.
         */
        routerConfig={extractRouterConfig(ourFileRouter)}
      />
      {children}
    </>
  );
}
