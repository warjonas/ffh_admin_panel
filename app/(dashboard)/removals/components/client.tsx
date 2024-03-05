'use client';

import React from 'react';
import { BodyRemovalColumn, columns } from './columns';
import { DataTable } from '@/components/ui/data-table';

interface BodyRemovalClientProps {
  data: BodyRemovalColumn[];
}

export const BodyRemovalClient: React.FC<BodyRemovalClientProps> = ({
  data,
}) => {
  return (
    <>
      <DataTable columns={columns} data={data} searchKey="name" />
    </>
  );
};
