'use client';

import { Arrangement, Receipt, Removal } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import React, { useEffect, useState } from 'react';
import useSWR, { SWRConfiguration } from 'swr';
import { DataTable } from '../ui/data-table';
import { format } from 'date-fns';
import { Modal } from '../ui/modal';
import { useOutstandingPaymentsModal } from '@/hooks/use-deceased-modal';
import { formatter } from '@/lib/utils';

type Props = {};

interface outstandingPaymentColumns {
  type: string;
  amount: number;
  paidUp: boolean;

  deceased: string;
  date: Date;
}

const columns: ColumnDef<outstandingPaymentColumns>[] = [
  {
    accessorKey: 'deceased',
    header: 'For Deceased',
  },
  {
    accessorKey: 'type',
    header: 'Type',
  },

  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => <div>{formatter.format(row.original.amount)}</div>,
  },
];

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const OutstandingPaymentsModal = (props: Props) => {
  const modal = useOutstandingPaymentsModal();
  const [loading, setLoading] = useState(true);
  const [outstanding, setOutstanding] = useState<outstandingPaymentColumns[]>(
    []
  );

  const config: SWRConfiguration = {
    revalidateOnMount: true,
    refreshInterval: 1000,
  };

  const {
    data: arrangments,
    error: arrangementsError,
    isLoading: arrangementsLoading,
  }: { data: Arrangement[]; error: any; isLoading: any } = useSWR(
    `/api/arrangement`,
    fetcher,
    config
  );
  const {
    data: removals,
    error: removalsError,
    isLoading: removalsLoading,
  }: { data: Removal[]; error: any; isLoading: any } = useSWR(
    `/api/removal`,
    fetcher,
    config
  );

  useEffect(() => {
    if (removals && arrangments) {
      setLoading(false);

      const formattedRemovals: outstandingPaymentColumns[] = removals.map(
        (item) => ({
          amount: item.outstandingBalance,
          deceased: item.deceased.firstNames + ' ' + item.deceased.lastName,
          type: 'Removal/Transfer',
          paidUp: item.outstandingBalance == 0 ? true : false,
          date: item.dateRequested,
        })
      );

      const formattedArrangements: outstandingPaymentColumns[] =
        arrangments.map((item) => ({
          amount: item.outstandingBalance,
          deceased: item.deceased.firstNames + ' ' + item.deceased.lastName,
          type: 'Funeral Arrangement',
          paidUp: item.paidUp,
          date: new Date(item.dateOfFuneralService),
        }));

      const formattedItems: outstandingPaymentColumns[] =
        formattedArrangements.concat(formattedRemovals);

      const outstandingPay = formattedItems.filter((item) => !item.paidUp);

      setOutstanding(outstandingPay);
    }
  }, [removals, arrangments]);

  if (removalsLoading || arrangementsLoading) {
    return (
      <Modal
        title={`Loading`}
        description=""
        isOpen={modal.isOpen}
        onClose={modal.onClose}
      >
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      title={`Outstanding Payments`}
      description="View Summary of outstanding payments"
      isOpen={modal.isOpen}
      onClose={modal.onClose}
    >
      <DataTable columns={columns} data={outstanding} searchKey="deceased" />
    </Modal>
  );
};

export default OutstandingPaymentsModal;
