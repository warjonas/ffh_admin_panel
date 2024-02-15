'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
// import { CellAction } from './cell-action';

export type DeceasedColumn = {
  id: string;

  firstName: string;
  lastName: string;
  idNumber: string;
  dateOfBirth: string;
  dateOfDeath: string;
};

export const columns: ColumnDef<DeceasedColumn>[] = [
  {
    accessorKey: 'lastName',
    header: 'Full Name',
    cell: ({ row }) => (
      <div>
        {row.original.firstName} {row.original.lastName}
      </div>
    ),
  },
  {
    accessorKey: 'idNumber',
    header: 'ID Number',
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
