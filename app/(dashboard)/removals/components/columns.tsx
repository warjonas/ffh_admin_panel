'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
// import { CellAction } from './cell-action';

export type BodyRemovalColumn = {
  id: string;
  requestedDate: string;
  undertaker: string;
  firstName: string;
  lastName: string;
  total: string;
  scheduledBy: string;
};

export const columns: ColumnDef<BodyRemovalColumn>[] = [
  {
    accessorKey: 'name',
    header: 'Full Name of Deceased',
    cell: ({ row }) => (
      <div>
        {row.original.firstName} {row.original.lastName}
      </div>
    ),
  },
  {
    accessorKey: 'removalDate',
    header: 'Removal Date',
  },
  {
    accessorKey: 'undertaker',
    header: 'By Undertaker',
  },
  {
    accessorKey: 'total',
    header: 'Total Due',
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
