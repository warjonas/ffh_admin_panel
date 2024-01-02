'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
// import { CellAction } from './cell-action';

export type ArrangementColumn = {
  id: string;
  receiptNo: string;
  firstName: string;
  lastName: string;

  memberNo: string;
  createdAt: string;
};

export const columns: ColumnDef<ArrangementColumn>[] = [
  {
    accessorKey: 'receiptNo',
    header: 'Invoice No.',
  },
  {
    accessorKey: 'name',
    header: 'Full Name',
    cell: ({ row }) => (
      <div>
        {row.original.firstName} {row.original.lastName}
      </div>
    ),
  },
  {
    accessorKey: 'memberNo',
    header: 'Member No.',
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
