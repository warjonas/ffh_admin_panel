import Image from 'next/image';
import React, { Suspense } from 'react';

import Heading from '@/components/ui/heading';
import Sidebar from './components/sidebar';
import SidebarViews from './components/sidebar-views';
import Loading from '../Loading';
import { getRole } from '@/actions/getRole';
import { getSession } from '@auth0/nextjs-auth0';

type Props = {};

const Admin = async (props: Props) => {
  const session = await getSession();

  const role = await getRole(session?.user?.email);

  return (
    <section className="p-5 w-full h-full flex flex-col">
      <Suspense fallback={<Loading />}>
        <Heading title="Settings" subtitle="Manage User access and more " />

        <section className="flex flex-row w-full gap-x-20">
          <Sidebar />
          <SidebarViews role={role} />
        </section>
      </Suspense>
    </section>
  );
};

export default Admin;
