import Image from 'next/image';
import React, { Suspense } from 'react';

import underContruction from '@/assets/220880-P1KV8M-746.jpg';
import Sidebar from './components/sidebar';
import Heading from '@/components/ui/heading';
import SidebarViews from './components/sidebar-views';
import prismadb from '@/lib/prismadb';
import Loading from '../../Loading';
import axios from 'axios';
import { ExpenseColumns } from './components/columns/expense-columns';
import { Expense } from '@prisma/client';
import { getExpByCat } from '@/actions/getExpByCat';

type Props = {};

const Pricing = async (props: Props) => {
  const expenses = await prismadb.expense.findMany({});
  const table = await getExpByCat();

  return (
    <section className="p-5 w-full h-full flex flex-col">
      <Heading
        title="Statistics"
        subtitle="Detailed information of the business "
      />
      <section className="flex gap-x-20 w-full">
        <Sidebar />
        <Suspense fallback={<Loading />}>
          <SidebarViews expenseData={expenses} tableData={table} />
        </Suspense>
      </section>
    </section>
  );
};

export default Pricing;
