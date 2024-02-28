'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
// import { CellAction } from './cell-action';

export type ArrangementColumn = {
  id: string;
  deceasedId: string;
  receiptNo: string;
  name: string;
  idNumber: string;
  memberNo: string;
  dateOfDeath: string;
  paidUp: boolean;
};

export const columns: ColumnDef<ArrangementColumn>[] = [
  {
    accessorKey: 'receiptNo',
    header: 'Invoice No.',
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
    accessorKey: 'dateOfDeath',
    header: 'Passed on',
  },

  {
    accessorKey: 'paidUp',
    header: 'Is Paid',
    cell: ({ row }) => (
      <div className="w-1/2 rounded-lg shadow-md">
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
    id: 'actions',
    cell: ({ row }) => (
      <CellAction data={row.original} deceasedId={row.original.deceasedId} />
    ),
  },
];
