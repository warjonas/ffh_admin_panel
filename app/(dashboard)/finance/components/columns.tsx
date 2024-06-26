'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { formatter } from '@/lib/utils';
import { format } from 'date-fns';
// import { CellAction } from './cell-action';

export type ExpenseColumn = {
  id: string;
  description: string;
  category: string;
  sub_category: string;
  amount: number;
  created: Date;
};

export const columns: ColumnDef<ExpenseColumn>[] = [
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => <div>{row.original.description}</div>,
  },
  {
    accessorKey: 'category',
    header: 'Category',
  },

  {
    accessorKey: 'sub_category',
    header: 'Sub-Category',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => <div>{formatter.format(row.original.amount)}</div>,
  },
  {
    accessorKey: 'created',
    header: 'Created On',
    cell: ({ row }) => (
      <div>{format(new Date(row.original.created), 'dd/MM/yyyy')}</div>
    ),
  },

  {
    id: 'actions',
    cell: ({ row }) => (
      <CellAction data={row.original} deceasedId={row.original.id} />
    ),
  },
];
