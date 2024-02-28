'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
// import { CellAction } from './cell-action';

export type FuneralProgramColumn = {
  id: string;
  name: string;
  dateOfBirth: string;
  dateOfDeath: string;
  language: string;
  idNumber: string;
  createdBy: string;
  dateOfFuneral: string;
};

export const columns: ColumnDef<FuneralProgramColumn>[] = [
  {
    accessorKey: 'name',
    header: 'Full Name of Deceased',
    cell: ({ row }) => <div>{row.original.name}</div>,
  },
  {
    accessorKey: 'idNumber',
    header: 'ID Number',
  },

  {
    accessorKey: 'language',
    header: 'Language of Program',
  },
  {
    accessorKey: 'dateOfBirth',
    header: 'Sunrise',
  },
  {
    accessorKey: 'dateOfDeath',
    header: 'Sunset',
  },
  {
    accessorKey: 'dateOfFuneral',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Date of Funeral
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
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
