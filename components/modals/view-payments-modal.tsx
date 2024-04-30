'use client';

import { Receipt } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import React, { useEffect, useState } from 'react';
import useSWR, { SWRConfiguration } from 'swr';
import { DataTable } from '../ui/data-table';
import { format } from 'date-fns';
import { Modal } from '../ui/modal';
import { useViewPaymentsModal } from '@/hooks/use-deceased-modal';

type Props = {};

interface paymentColumns {
  id: string;
  amount: number;
  payer: string;
  date: Date;
  deceased: string;
}

const columns: ColumnDef<paymentColumns>[] = [
  {
    accessorKey: 'id',
    header: 'Receipt No',
  },
  {
    accessorKey: 'deceased',
    header: 'For Deceased',
  },
  {
    accessorKey: 'payer',
    header: 'Payer',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => (
      <div>{format(new Date(row.original.date), 'dd/MM/yyyy')}</div>
    ),
  },
];

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ViewPaymentsModal = (props: Props) => {
  const modal = useViewPaymentsModal();
  const [loading, setLoading] = useState(true);
  const [receipts, setReceipts] = useState<paymentColumns[]>([]);

  const config: SWRConfiguration = {
    revalidateOnMount: true,
  };

  const {
    data,
    error,
    isLoading,
  }: { data: Receipt[]; error: any; isLoading: any } = useSWR(
    `/api/receipt`,
    fetcher,
    config
  );

  useEffect(() => {
    if (data) {
      setLoading(false);

      let formattedReceipts: paymentColumns[] = data.map((item) => ({
        amount: item.receivedAmount,
        id: item.receiptNo,
        deceased:
          item.arrangement?.deceased.firstNames +
          ' ' +
          item?.arrangement?.deceased.lastName,
        date: item.date,
        payer: item.receivedFrom,
      }));

      setReceipts(formattedReceipts);
    }
  }, [data]);

  if (isLoading && loading) {
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
      title={`All Payments`}
      description="View Summary of all payments made"
      isOpen={modal.isOpen}
      onClose={modal.onClose}
    >
      <DataTable columns={columns} data={receipts} searchKey="deceased" />
    </Modal>
  );
};

export default ViewPaymentsModal;
