import Image from 'next/image';
import React, { Suspense } from 'react';

import underContruction from '@/assets/220880-P1KV8M-746.jpg';
import Heading from '@/components/ui/heading';
import Link from 'next/link';
import Sidebar from './components/sidebar';
import SidebarViews from './components/sidebar-views';
import Loading from '../loading';

type Props = {};

const Admin = (props: Props) => {
  return (
    <section className="p-5 w-full h-full flex flex-col">
      <Suspense fallback={<Loading />}>
        <Heading title="Settings" subtitle="Manage User access and more " />

        <section className="flex flex-row w-full gap-x-20">
          <Sidebar />
          <SidebarViews />
        </section>
      </Suspense>
    </section>
  );
};

export default Admin;
