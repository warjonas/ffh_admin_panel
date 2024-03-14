import Heading from '@/components/ui/heading';
import React from 'react';
import HeaderOptions from '@/components/ui/header-options';
import { ArrangementClient } from './components/client';
import prismadb from '@/lib/prismadb';
import { ArrangementColumn } from './components/columns';
import { format } from 'date-fns';
import RemovalPreview from '../../../components/data-preview';
import DataPreview from '../../../components/data-preview';

type Props = {};

const Arrangements = async (props: Props) => {
  const arrangements = await prismadb.arrangement.findMany({
    where: {
      deceased: {
        flagDelete: false,
      },
    },
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
      deceasedId: item.deceasedId,
      receiptNo: item.invoiceNo,
      memberNo: item.deceased.ffhMemberNo,
      name: item.deceased.firstNames + ' ' + item.deceased.lastName,
      dateOfDeath: format(item.deceased.dateOfDeath, 'MM/dd/yyyy'),
      paidUp: item.paidUp,
      idNumber: item.deceased.idNumber,
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
          <HeaderOptions title="New Arrangement" link="arrangement" />
        </div>
      </section>
      <section className="flex flex-row h-full mt-5 mb-5">
        <div className="w-2/3 h-full">
          <ArrangementClient data={formattedArrangements} />
        </div>
        <div className="w-1/3 px-5">
          <DataPreview heading="Funeral Arrangement Preview" />
        </div>
      </section>
    </section>
  );
};

export default Arrangements;
