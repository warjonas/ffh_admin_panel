'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Modal } from '@/components/ui/modal';

import useSWR, { SWRConfiguration } from 'swr';

import { QueryProps, SubExpCategory } from '@/types';
import { format } from 'date-fns';
import {
  useAddSubCategoryModal,
  useSubCategoryListModal,
} from '@/hooks/use-deceased-modal';
import { Button } from '../ui/button';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const SubCategoryListModal = () => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const expCatId = searchParams.get('expCatId');

  const subCategoryListModal = useSubCategoryListModal();

  const addSubCategoryModal = useAddSubCategoryModal();

  const config: SWRConfiguration = {
    revalidateOnFocus: true,
    refreshInterval: 800,
  };

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

  const {
    data,
    error,
    isLoading,
  }: { data: SubExpCategory[]; error: any; isLoading: any } = useSWR(
    expCatId ? `/api/category/sub_category/filter/${expCatId}` : null,
    fetcher,
    config
  );

  const onClose = () => {
    subCategoryListModal.onClose();
    router.back();
  };

  const onEdit = async (subCatId: string) => {
    const query: QueryProps[] = [{ name: 'subCatId', value: subCatId }];

    router.push(pathname + '?' + createQueryString(query) + '#expenses');
    addSubCategoryModal.onOpen();
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  if (error) {
    return (
      <Modal
        title={`Error Occurred`}
        description=""
        isOpen={subCategoryListModal.isOpen}
        onClose={onClose}
      >
        An error occurred whilte fetching the data.
      </Modal>
    );
  }

  if (isLoading) {
    return (
      <Modal
        title={`Loading`}
        description=""
        isOpen={subCategoryListModal.isOpen}
        onClose={onClose}
      >
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      title={`Manage Sub Categories
      `}
      description="Manage sub categories for selected expense type"
      isOpen={subCategoryListModal.isOpen}
      onClose={onClose}
    >
      <hr className="w-full my-2" />
      <section className="flex flex-col w-full gap-y-2">
        <section className="w-full flex flex-row justify-end">
          <Button onClick={addSubCategoryModal.onOpen}>
            {' '}
            Add Sub-Category
          </Button>
        </section>
        <section></section>
        <div className="p-3 rounded-lg shadow-md border border-solid flex flex-col">
          <h2 className="font-semibold">Description</h2>
          <hr className="w-full my-2" />
          {data?.length ? (
            data.map((subCategory) => {
              return (
                <div
                  className="col-start-1 col-span-1 flex flex-col hover:cursor-pointer hover:bg-slate-100 transition-all duration-300 p-2 rounded-sm"
                  key={subCategory.id}
                  onClick={() => onEdit(subCategory.id)}
                >
                  <p>{subCategory.name}</p>
                </div>
              );
            })
          ) : (
            <p className="my-5 text-center">No Data Available.</p>
          )}
        </div>
      </section>
    </Modal>
  );
};
