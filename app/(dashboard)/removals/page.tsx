import HeaderOptions from '@/components/ui/header-options';
import Heading from '@/components/ui/heading';
import prismadb from '@/lib/prismadb';
import React from 'react';
import { BodyRemovalColumn } from './components/columns';
import { format } from 'date-fns';
import { formatter } from '@/lib/utils';
import { BodyRemovalClient } from './components/client';
import { Receipt } from 'lucide-react';

type Props = {};

const Removals = async (props: Props) => {
  const bodyRemovals = await prismadb.removal.findMany({
    include: {
      receipts: true,
      deceased: true,
    },
  });

  const formattedRemovals: BodyRemovalColumn[] = bodyRemovals.map(
    (removal) => ({
      id: removal.id,
      firstName: removal.deceased.firstNames,
      lastName: removal.deceased.lastName,
      scheduledBy: removal.scheduledBy,
      requestedDate: format(removal.deceased.removalDate, 'MM/dd/yyyy'),
      undertaker: removal.byUndertaker,
      total: formatter.format(removal.totalDue),
    })
  );
  return (
    <section className="p-5 w-full h-full">
      <Heading
        title="Body Removals"
        subtitle="Schedule and Update body removals"
      />
      <section>
        <div className="flex justify-between">
          <HeaderOptions title="Schedule removal" link="removal" />
        </div>
      </section>
      <BodyRemovalClient data={formattedRemovals} />
      <section></section>
    </section>
  );
};

export default Removals;
