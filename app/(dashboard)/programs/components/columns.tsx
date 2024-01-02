'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
// import { CellAction } from './cell-action';

export type FuneralProgramColumn = {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  dateOfDeath: string;
  language: string;

  createdBy: string;
};

export const columns: ColumnDef<FuneralProgramColumn>[] = [
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
    accessorKey: 'language',
    header: 'Language of Program',
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
    accessorKey: 'createdBy',
    header: 'Created By',
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
