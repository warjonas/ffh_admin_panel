'use client';

import { ColumnDef } from '@tanstack/react-table';
import { formatter } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// import { CellAction } from './cell-action';

export type Columns = {
  id: string;
  category: string;

  Jan: number;
  Feb: number;
  Mar: number;
  Apr: number;
  May: number;
  Jun: number;
  Jul: number;
  Aug: number;
  Sep: number;
  Oct: number;
  Nov: number;
  Dec: number;
};

export const columns: ColumnDef<Columns>[] = [
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => (
      <div>
        <Link href={`/admin/stats/${row.original.id}`}>
          {row.original.category}
        </Link>
      </div>
    ),
  },
  {
    accessorKey: 'Jan',
    header: 'Jan',
    cell: ({ row }) => <div>{formatter.format(row.original.Jan)}</div>,
  },

  {
    accessorKey: 'Feb',
    header: 'Feb',
    cell: ({ row }) => <div>{formatter.format(row.original.Feb)}</div>,
  },
  {
    accessorKey: 'Mar',
    header: 'Mar',
    cell: ({ row }) => <div>{formatter.format(row.original.Mar)}</div>,
  },
  {
    accessorKey: 'Apr',
    header: 'Apr',
    cell: ({ row }) => <div>{formatter.format(row.original.Apr)}</div>,
  },
  {
    accessorKey: 'May',
    header: 'May',
    cell: ({ row }) => <div>{formatter.format(row.original.May)}</div>,
  },
  {
    accessorKey: 'Jun',
    header: 'June',
    cell: ({ row }) => <div>{formatter.format(row.original.Jun)}</div>,
  },
  {
    accessorKey: 'Jul',
    header: 'Jul',
    cell: ({ row }) => <div>{formatter.format(row.original.Jul)}</div>,
  },
  {
    accessorKey: 'Aug',
    header: 'Aug',
    cell: ({ row }) => <div>{formatter.format(row.original.Aug)}</div>,
  },
  {
    accessorKey: 'Sep',
    header: 'Sep',
    cell: ({ row }) => <div>{formatter.format(row.original.Sep)}</div>,
  },
  {
    accessorKey: 'Oct',
    header: 'Oct',
    cell: ({ row }) => <div>{formatter.format(row.original.Oct)}</div>,
  },
  {
    accessorKey: 'Nov',
    header: 'Nov',
    cell: ({ row }) => <div>{formatter.format(row.original.Nov)}</div>,
  },
  {
    accessorKey: 'Dec',
    header: 'Dec',
    cell: ({ row }) => <div>{formatter.format(row.original.Dec)}</div>,
  },
];
