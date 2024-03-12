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
  paidUp: boolean;
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
  // {
  //   accessorKey: 'outstandingBalance',
  //   header: 'Outstanding Balance',
  //   cell: ({ row }) => (
  //     <div
  //       className={`${
  //         row.original.outstandingBalance > 0
  //           ? 'text-red-700'
  //           : 'text-green-700'
  //       }`}
  //     >
  //       {formatter.format(row.original.outstandingBalance)}
  //     </div>
  //   ),
  // },
  {
    accessorKey: 'paidUp',
    header: 'Is Paid',
    cell: ({ row }) => (
      <div className="w-fit rounded-lg shadow-md">
        {row.original.paidUp ? (
          <div className="text-slate-50 p-2 bg-green-700 rounded-lg">
            {' '}
            Paid Up
          </div>
        ) : (
          <div className="text-slate-50 p-2 bg-red-800 rounded-lg"> Unpaid</div>
        )}
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
