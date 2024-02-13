import Heading from '@/components/ui/heading';
import React from 'react';
import HeaderOptions from '@/components/ui/header-options';
import { ArrangementClient } from './components/client';
import prismadb from '@/lib/prismadb';
import { ArrangementColumn } from './components/columns';
import { format } from 'date-fns';

type Props = {};

const Arrangements = async (props: Props) => {
  const arrangements = await prismadb.arrangement.findMany({
    include: {
      deceased: true,
    },
    orderBy: {
      deceased: {
        dateOfDeath: 'desc',
      },
    },
  });

  const formattedArrangements: ArrangementColumn[] = arrangements.map(
    (item) => ({
      id: item.id,
      receiptNo: item.receiptNo,
      memberNo: item.deceased.ffhMemberNo,
      firstName: item.deceased.firstNames,
      lastName: item.deceased.lastName,
      createdAt: format(item.deceased.dateOfDeath, 'MM/dd/yyyy'),
    })
  );

  return (
    <section className="p-5 w-full h-full">
      <Heading
        title="Arrangements"
        subtitle="Create and manage funeral arrangements"
      />
      <section>
        <div className="flex justify-between">
          <HeaderOptions title="New Arrangement" path="/arrangements/new" />
        </div>
      </section>
      <section>
        <ArrangementClient data={formattedArrangements} />
      </section>
    </section>
  );
};

export default Arrangements;
