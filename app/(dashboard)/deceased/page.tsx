import Heading from '@/components/ui/heading';
import React, { Suspense } from 'react';
import HeaderOptions from '@/components/ui/header-options';
import { DeceasedClient } from './components/client';
import prismadb from '@/lib/prismadb';
import { DeceasedColumn } from './components/columns';
import { format } from 'date-fns';
import Loading from '../Loading';

type Props = {};

const Deceased = async (props: Props) => {
  const deceased = await prismadb.deceased.findMany({
    where: {
      flagDelete: false,
    },
    orderBy: {
      dateOfDeath: 'desc',
    },
  });

  const formattedDeceased: DeceasedColumn[] = deceased.map((item) => ({
    id: item.id,
    idNumber: item.idNumber,
    name: item.firstNames + ' ' + item.lastName,

    dateOfBirth: format(item.dateOfBirth, 'MM/dd/yyyy'),
    dateOfDeath: format(item.dateOfDeath, 'MM/dd/yyyy'),

    createdAt: format(item.dateOfDeath, 'MM/dd/yyyy'),
  }));

  return (
    <section className="p-5 w-full h-full">
      <Heading
        title="Deceased Details"
        subtitle="Create and manage Deceased Details  "
      />
      <section>
        <div className="flex justify-between">
          <HeaderOptions title="New Deceased details" link="deceased" />
        </div>
      </section>
      <Suspense fallback={<Loading />}>
        <section>
          <DeceasedClient data={formattedDeceased} />
        </section>
      </Suspense>
    </section>
  );
};

export default Deceased;
