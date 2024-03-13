'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
// import { CellAction } from './cell-action';

export type DeceasedColumn = {
  id: string;

  name: string;
  idNumber: string;
  dateOfBirth: string;
  dateOfDeath: string;
};

export const columns: ColumnDef<DeceasedColumn>[] = [
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
    accessorKey: 'dateOfBirth',
    header: 'Date Of Birth',
  },
  {
    accessorKey: 'dateOfDeath',
    header: 'Date Of Death',
  },

  {
    accessorKey: 'createdAt',
    header: 'Added On',
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
