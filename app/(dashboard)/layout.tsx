import Sidebar from '@/components/sidebar';
import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';

import React from 'react';

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
      {children}
    </>
  );
}
