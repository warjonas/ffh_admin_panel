'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { DeceasedColumn, columns } from './columns';
import { DataTable } from '@/components/ui/data-table';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface DeceasedClientProps {
  data: DeceasedColumn[];
}

export const DeceasedClient: React.FC<DeceasedClientProps> = ({ data }) => {
  const [key, setKey] = useState('name');

  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-col justify-start gap-x-2 p-3 pl-0 items-start">
        <Label className="text-lg">Search By:</Label>
        <Select value={key} onValueChange={setKey}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="S" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Search By:</SelectLabel>
              <SelectItem value="lastName">Last Name</SelectItem>
              <SelectItem value="idNumber">ID Number</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <DataTable columns={columns} data={data} searchKey={key} />
    </div>
  );
};
