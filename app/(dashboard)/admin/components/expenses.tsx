'use client';

import { AlertModal } from '@/components/modals/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  useCoffinModal,
  useCrossModal,
  useExpCategoryModal,
  useSubCategoryListModal,
} from '@/hooks/use-deceased-modal';
import { formatter } from '@/lib/utils';
import { Coffin, CrossSizes, ExpCategory } from '@/types';
import axios from 'axios';
import { Edit, Link, ListTree, MoreHorizontal, Pencil, X } from 'lucide-react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React, { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import useSWR, { SWRConfiguration } from 'swr';

type Props = {};

const fetcher = (url: string) => fetch(url).then((res) => res.json());
interface QueryProps {
  name: string;
  value: string;
}

const ExpenseCategories = (props: Props) => {
  const expCategoryModal = useExpCategoryModal();
  const subCategoryListModal = useSubCategoryListModal();

  const [Loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const createQueryString = useCallback(
    (queries: QueryProps[]) => {
      const params = new URLSearchParams(searchParams.toString());
      queries.map((query) => {
        params.set(query.name, query.value);
      });

      return params.toString();
    },
    [searchParams]
  );

  const config: SWRConfiguration = {
    revalidateOnFocus: true,
    revalidateIfStale: true,
    revalidateOnMount: true,
    refreshInterval: 800,
  };

  const {
    data,
    error,
    isLoading,
  }: { data: ExpCategory[]; error: any; isLoading: any } = useSWR(
    `/api/category`,
    fetcher,
    config
  );

  const onEdit = (id: string) => {
    const query: QueryProps[] = [{ name: 'expCatId', value: id }];

    router.push(pathname + '?' + createQueryString(query) + '#expenses');
    expCategoryModal.onOpen();
  };

  const onManage = (id: string) => {
    const query: QueryProps[] = [{ name: 'expCatId', value: id }];

    router.push(pathname + '?' + createQueryString(query) + '#expenses');
    subCategoryListModal.onOpen();
  };

  return (
    <section className="w-full flex flex-row">
      {/* list of coffins */}

      <div className="flex flex-col w-1/2">
        <div className="flex flex-row justify-between">
          <h1 className="text-2xl font-semibold">Manage Expense Categories</h1>
          <Button onClick={expCategoryModal.onOpen}> Add New Category</Button>
        </div>
        <hr className="w-full my-3" />
        {isLoading ? (
          <div> Loading</div>
        ) : (
          <div className="flex flex-col gap-5">
            {data.length ? (
              data.map((category) => (
                <div
                  className=" grid grid-cols-3 flex-row w-full justify-between  border-b pb-2 "
                  key={category.id}
                >
                  <h2 className="font-medium col-start-1">{category.name}</h2>

                  <div className="flex flex-row gap-x-2 col-start-3 justify-end ">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open Menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>

                        <DropdownMenuItem onClick={() => onEdit(category.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Update
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => onManage(category.id)}>
                          <ListTree className="mr-2 h-4 w-4" />
                          Manage Sub Categories
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            ) : (
              <p>No data available.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ExpenseCategories;

{
  /* <>
  <Pencil
    className="h-6 w-6 p-1 bg-blue-900 text-background rounded-full  hover:cursor-pointer"
    onClick={() => onEdit(cross.id)}
  />
  <X
    className="h-6 w-6 bg-red-900 text-background rounded-full col-start-7 justify-center hover:cursor-pointer"
    onClick={() => onDelete(cross.id)}
  />
</>; */
}
