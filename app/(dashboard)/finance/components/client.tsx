'use client';

import React, { useCallback, useState } from 'react';
import { ExpenseColumn, columns } from './columns';
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
import { ExpCategory, SubExpCategory } from '@prisma/client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface ExpenseClientProps {
  data: ExpenseColumn[];
  categories: ExpCategory[];
  subCategories: SubExpCategory[];
}

export const ExpenseClient: React.FC<ExpenseClientProps> = ({
  data,
  categories,
  subCategories,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const catId = searchParams.get('categoryId');
  const subCatId = searchParams.get('subCatId');

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const onCatChange = (value: string) => {
    if (value == 'all') {
      router.push(pathname);
    } else {
      router.push(pathname + '?' + createQueryString('categoryId', value));
    }
  };

  const onSubChange = (value: string) => {
    if (value == 'all') {
      router.push(pathname);
    } else {
      router.push(pathname + '?' + createQueryString('subCatId', value));
    }
  };

  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-row justify-start gap-x-2 p-3 pl-0 items-start">
        <section className="flex items-center gap-x-5 border-r pr-4">
          <Label className="text-lg">Categories:</Label>
          <Select onValueChange={(value: string) => onCatChange(value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Categories:</SelectLabel>
                <SelectItem value="all">All</SelectItem>
                {categories.map((cat) => (
                  <SelectItem value={cat.id} key={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </section>
        <section className="flex items-center gap-x-5 ">
          <Label className="text-lg">Sub Category:</Label>
          <Select onValueChange={(value: string) => onSubChange(value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Sub Category:</SelectLabel>
                <SelectItem value="all">All</SelectItem>
                {subCategories.map((sub) => (
                  <SelectItem value={sub.id} key={sub.id}>
                    {sub.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </section>
      </div>
      <hr className="w-full mb-5" />
      <DataTable columns={columns} data={data} searchKey={'description'} />
    </div>
  );
};
