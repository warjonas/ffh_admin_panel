'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
// import { CellAction } from './cell-action';

export type DeceasedColumn = {
  id: string;

  firstName: string;
  lastName: string;
  dateOfBirth: string;
  dateOfDeath: string;
  createdAt: string;
};

export const columns: ColumnDef<DeceasedColumn>[] = [
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
    accessorKey: 'dateOfBirth',
    header: 'Date Of Birth',
  },
  {
    accessorKey: 'dateOfDeath',
    header: 'Date Of Death',
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
