import Heading from '@/components/ui/heading';
import React from 'react';
import HeaderOptions from '@/components/ui/header-options';
import { DeceasedClient } from './components/client';
import prismadb from '@/lib/prismadb';
import { DeceasedColumn } from './components/columns';
import { format } from 'date-fns';

type Props = {};

const Deceased = async (props: Props) => {
  const deceased = await prismadb.deceased.findMany({
    orderBy: {
      dateOfDeath: 'desc',
    },
  });

  const formattedDeceased: DeceasedColumn[] = deceased.map((item) => ({
    id: item.id,
    idNumber: item.idNumber,

    firstName: item.firstNames,
    lastName: item.lastName,
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
          <HeaderOptions title="New Deceased details" link="/deceased/new" />
        </div>
      </section>
      <section>
        <DeceasedClient data={formattedDeceased} />
      </section>
    </section>
  );
};

export default Deceased;
