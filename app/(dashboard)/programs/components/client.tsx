'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { FuneralProgramColumn, columns } from './columns';
import { DataTable } from '@/components/ui/data-table';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, StoreIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';

interface FuneralProgramClientProps {
  data: FuneralProgramColumn[];
}

const items = [
  {
    id: 1,
    label: 'Invoice',
    value: 'invoice',
  },
  {
    id: 2,
    label: 'First Name',
    value: 'firstName',
  },
  {
    id: 3,
    label: 'Member No.',
    value: 'memberNo',
  },
];

export const FuneralClient: React.FC<FuneralProgramClientProps> = ({
  data,
}) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <DataTable columns={columns} data={data} searchKey="name" />
    </>
  );
};
