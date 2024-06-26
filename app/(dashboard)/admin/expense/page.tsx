import Image from 'next/image';
import React, { Suspense } from 'react';

import Heading from '@/components/ui/heading';

import Loading from '../../Loading';

type Props = {};

const Expense = (props: Props) => {
  return (
    <section className="p-5 w-full h-full flex flex-col">
      <Suspense fallback={<Loading />}>
        <Heading
          title="Expenses"
          subtitle="View and Manage Business Expenses"
        />
      </Suspense>
    </section>
  );
};

export default Expense;
