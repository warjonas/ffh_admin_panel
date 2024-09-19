'use client';

import { Receipt } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import React, { useEffect, useState } from 'react';
import useSWR, { SWRConfiguration } from 'swr';
import { DataTable } from '../ui/data-table';
import { format } from 'date-fns';
import { Modal } from '../ui/modal';
import { useViewPaymentsModal } from '@/hooks/use-deceased-modal';
import { useArrangeInvoice, useInvoice } from '@/hooks/use-invoice-modal';
import { useRouter } from 'next/navigation';
import { Info } from 'lucide-react';

type Props = {};

interface paymentColumns {
  id: string;
  amount: number;
  payer: string;
  date: Date;
  deceased: string;
  deceasedId: string;
  invoiceId: string;
  type: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ViewPaymentsModal = (props: Props) => {
  const modal = useViewPaymentsModal();
  const useInvoiceModal = useInvoice();
  const useArrangeInvoiceModal = useArrangeInvoice();

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [receipts, setReceipts] = useState<paymentColumns[]>([]);

  const columns: ColumnDef<paymentColumns>[] = [
    {
      accessorKey: 'id',
      header: 'Receipt No',
    },
    {
      accessorKey: 'deceased',
      header: 'For Invoice',
      cell: ({ row }) => (
        <div
          className="hover:cursor-pointer flex gap-x-2 align-middle"
          onClick={() => {
            switch (row.original.type) {
              case 'arrangement':
                useArrangeInvoiceModal.onOpen(row.original.deceasedId);
                break;
              case 'custom':
                useInvoiceModal.onOpen(row.original.invoiceId);
                break;
              case 'removal':
                break;

              default:
                break;
            }
          }}
        >
          {row.original.deceased} <Info className="text-slate-00 h-4 w-4" />
        </div>
      ),
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

  const config: SWRConfiguration = {
    revalidateOnMount: true,
    refreshInterval: 1000,
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
        deceased: item.arrangement
          ? item.arrangement?.deceased.firstNames +
            ' ' +
            item?.arrangement?.deceased.lastName
          : item.removal
          ? item.removal?.deceased.firstNames +
            ' ' +
            item?.removal.deceased.lastName
          : item.invoice?.customerDetails.firstName +
            ' ' +
            item.invoice?.customerDetails.lastName,
        date: item.date,
        payer: item.receivedFrom,
        invoiceId: item.invoice ? item.invoice.invoiceNo : item.invoiceId,
        type: item.arrangement
          ? 'arrangement'
          : item.removal
          ? 'removal'
          : 'custom',
        deceasedId: item.arrangement ? item.arrangement.deceased.id : ' ',
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
