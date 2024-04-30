import Image from 'next/image';
import React from 'react';

import underContruction from '@/assets/220880-P1KV8M-746.jpg';
import prismadb from '@/lib/prismadb';
import { InvoiceColumn } from './components/columns';
import { format } from 'date-fns';
import Heading from '@/components/ui/heading';
import { InvoiceClient } from './components/client';
import { formatter } from '@/lib/utils';
import OverviewBox from './components/overview-box';

type Props = {};

const Invoice = async (props: Props) => {
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

  const removals = await prismadb.removal.findMany({
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

  const receipts = await prismadb.receipt.findMany({});

  const formattedRemovals: InvoiceColumn[] = removals.map((item) => ({
    id: item.id,
    type: 'Removal',
    deceasedId: item.deceasedId,
    receiptNo: item.invoiceNo,
    memberNo: item.deceased.ffhMemberNo,
    name: item.deceased.firstNames + ' ' + item.deceased.lastName,
    dateOfDeath: format(item.deceased.dateOfDeath, 'MM/dd/yyyy'),
    paidUp: item.paidUp,
    idNumber: item.deceased.idNumber,
    outstanding: item.outstandingBalance,
    amountDue: item.totalDue,
    created: item.created,
  }));

  const formattedArrangements: InvoiceColumn[] = arrangements.map((item) => ({
    id: item.id,
    type: 'Arrangement',
    deceasedId: item.deceasedId,
    receiptNo: item.invoiceNo,
    memberNo: item.deceased.ffhMemberNo,
    name: item.deceased.firstNames + ' ' + item.deceased.lastName,
    dateOfDeath: format(item.deceased.dateOfDeath, 'MM/dd/yyyy'),
    paidUp: item.paidUp,
    idNumber: item.deceased.idNumber,
    outstanding: item.outstandingBalance,
    amountDue: item.totalDue,
    created: item.created,
  }));

  const formattedItems: InvoiceColumn[] =
    formattedArrangements.concat(formattedRemovals);

  const totalPayments = receipts.reduce((total, order) => {
    return total + order.receivedAmount;
  }, 0);

  const outstandingBalance = formattedItems.reduce((total, order) => {
    if (!order.paidUp) {
      return total + order.outstanding;
    } else {
      return total;
    }
  }, 0);

  return (
    <section className="p-5 w-full h-full ">
      <Heading title="Invoices" subtitle="Review of all invoices" />

      <section className="flex flex-row justify-between gap-5 h-full mt-5 mb-5">
        <div className="w-2/3 h-full">
          <InvoiceClient data={formattedArrangements} />
        </div>

        <div className="w-1/4 px-5 flex flex-col gap-8 h-fit border  rounded-md shadow-md p-4 mt-5 mr-10">
          <div>
            <h1 className="text-2xl font-medium">Financial Overview</h1>
            <hr className="w-full mt-2" />
          </div>

          <OverviewBox
            title="Total Payments"
            amount={totalPayments}
            subtitleLinkText="View payments"
            classes="bg-green-700 hover:bg-green-800"
            modal="payment"
          />
          <hr />
          <OverviewBox
            title="Outstanding Payments"
            amount={outstandingBalance}
            subtitleLinkText="View Outstanding"
            classes=" bg-red-800 hover:bg-red-900"
            modal="outstanding"
          />
        </div>
      </section>
    </section>
  );
};

export default Invoice;
