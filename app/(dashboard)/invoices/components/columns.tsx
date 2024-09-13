'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Decimal } from '@prisma/client/runtime/library';
import { formatter } from '@/lib/utils';
// import { CellAction } from './cell-action';

export type InvoiceColumn = {
  id: string;
  deceasedId: string;
  receiptNo: string;
  type: string;
  name: string;
  idNumber: string;
  memberNo?: string;
  dateOfDeath?: string;
  outstanding: number;
  amountDue: number;
  paidUp: boolean;
  created: Date;
};

export const columns: ColumnDef<InvoiceColumn>[] = [
  {
    accessorKey: 'receiptNo',
    header: 'Invoice No.',
  },
  {
    accessorKey: 'type',
    header: 'Invoice Type',
  },
  {
    accessorKey: 'name',
    header: 'Full Name',
    cell: ({ row }) => <div>{row.original.name}</div>,
  },
  {
    accessorKey: 'idNumber',
    header: 'ID Number',
  },

  {
    accessorKey: 'amountDue',
    header: 'Amount Due',
    cell: ({ row }) => <div>{formatter.format(row.original.amountDue)}</div>,
  },

  {
    accessorKey: 'paidUp',
    header: 'Is Paid',
    cell: ({ row }) => (
      <div className="w-full text-center rounded-lg shadow-md">
        {row.original.paidUp ? (
          <div className="text-slate-50 p-2 bg-green-700 rounded-lg uppercase">
            {' '}
            Paid Up
          </div>
        ) : (
          <div className="text-slate-50 p-2 bg-red-800 rounded-lg uppercase">
            {' '}
            Unpaid
          </div>
        )}
      </div>
    ),
  },

  {
    id: 'actions',
    cell: ({ row }) => (
      <CellAction data={row.original} deceasedId={row.original.deceasedId} />
    ),
  },
];
