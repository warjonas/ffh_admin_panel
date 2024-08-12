'use client';

import React, { useState } from 'react';
import { DataTable } from '@/components/ui/data-table';

import { Label } from '@/components/ui/label';
import { Columns, columns } from './columns';
import { TableData } from '@/types';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ClientProps {
  data: TableData[];

  categoryId: string;
}

export const Client: React.FC<ClientProps> = ({ data, categoryId }) => {
  const router = useRouter();
  const formattedData: Columns[] = data.map((item, i) => ({
    id: item.id,
    category: item.category,
    categoryId: categoryId,
    Jan: item.month[0].total,
    Feb: item.month[1].total,
    Mar: item.month[2].total,
    Apr: item.month[3].total,
    May: item.month[4].total,
    Jun: item.month[5].total,
    Jul: item.month[6].total,
    Aug: item.month[7].total,
    Sep: item.month[8].total,
    Oct: item.month[9].total,
    Nov: item.month[10].total,
    Dec: item.month[11].total,
  }));

  return (
    <div className="w-full flex flex-col gap-y-2">
      <h2
        onClick={() => router.back()}
        className="flex flex-row hover:cursor-pointer"
      >
        {' '}
        <ChevronLeft /> Back
      </h2>
      <DataTable
        columns={columns}
        data={formattedData}
        searchKey={'category'}
      />
    </div>
  );
};
