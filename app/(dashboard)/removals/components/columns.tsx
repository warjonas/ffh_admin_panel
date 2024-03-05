'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { formatter } from '@/lib/utils';
// import { CellAction } from './cell-action';

export type BodyRemovalColumn = {
  id: string;
  requestedDate: string;
  undertaker: string;
  name: string;
  total: number;
  scheduledBy: string;
  outstandingBalance: number;
};

export const columns: ColumnDef<BodyRemovalColumn>[] = [
  {
    accessorKey: 'name',
    header: 'Full Name of Deceased',
  },
  {
    accessorKey: 'requestedDate',
    header: 'Requested Date',
  },
  {
    accessorKey: 'undertaker',
    header: 'By Undertaker',
  },
  {
    accessorKey: 'total',
    header: 'Total',
    cell: ({ row }) => <div>{formatter.format(row.original.total)}</div>,
  },
  {
    accessorKey: 'outstandingBalance',
    header: 'Outstanding Balance',
    cell: ({ row }) => (
      <div
        className={`${
          row.original.outstandingBalance > 0
            ? 'text-red-700'
            : 'text-green-700'
        }`}
      >
        {formatter.format(row.original.outstandingBalance)}
      </div>
    ),
  },

  {
    accessorKey: 'scheduledBy',
    header: 'Scheduled By',
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
