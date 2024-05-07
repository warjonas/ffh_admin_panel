import HeaderOptions from '@/components/ui/header-options';
import Heading from '@/components/ui/heading';
import prismadb from '@/lib/prismadb';
import React, { Suspense } from 'react';
import { BodyRemovalColumn } from './components/columns';
import { format } from 'date-fns';
import { formatter } from '@/lib/utils';
import { BodyRemovalClient } from './components/client';
import { Receipt } from 'lucide-react';
import RemovalPreview from '../../../components/data-preview';
import DataPreview from '../../../components/data-preview';
import Loading from '../Loading';

const Removals = async () => {
  const bodyRemovals = await prismadb.removal.findMany({
    where: {
      deceased: {
        flagDelete: false,
      },
    },
    include: {
      receipts: true,
      deceased: true,
    },
  });

  const formattedRemovals: BodyRemovalColumn[] = bodyRemovals.map(
    (removal) => ({
      id: removal.id,
      deceasedId: removal.deceasedId,
      name: removal.deceased.firstNames + ' ' + removal.deceased.lastName,
      scheduledBy: removal.scheduledBy,
      requestedDate: format(removal.dateRequested, 'MM/dd/yyyy'),
      undertaker: removal.byUndertaker,
      total: removal.totalDue,
      outstandingBalance: removal.outstandingBalance,
      paidUp: removal.paidUp,
    })
  );

  return (
    <section className="p-5 w-full h-full">
      <Suspense fallback={<Loading />}>
        <Heading
          title="Body Removals"
          subtitle="Schedule and Update body removals"
        />
        <section>
          <div className="flex justify-between">
            <HeaderOptions title="Schedule removal" link="removal" />
          </div>
        </section>
        <section className="flex flex-row h-full mt-5 mb-5">
          <div className="w-2/3 h-full">
            <BodyRemovalClient data={formattedRemovals} />
          </div>
          <div className="w-1/3 px-5">
            <DataPreview heading="Deceased Removal Preview" />
          </div>
        </section>
      </Suspense>
    </section>
  );
};

export default Removals;
