'use client';

import { Button } from '@/components/ui/button';
import { useAddOnModal } from '@/hooks/use-deceased-modal';
import { formatter } from '@/lib/utils';
import { AddOn, Coffin } from '@/types';
import { Pencil, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useState } from 'react';
import useSWR, { SWRConfiguration } from 'swr';

type Props = {};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface QueryProps {
  name: string;
  value: string;
}

const AddOns = (props: Props) => {
  const [Loading, setLoading] = useState(false);

  const addOnModal = useAddOnModal();

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
  };

  const {
    data,
    error,
    isLoading,
  }: { data: AddOn[]; error: any; isLoading: any } = useSWR(
    `/api/addOn`,
    fetcher,
    config
  );

  return (
    <section className="w-full flex flex-row">
      {/* list of coffins */}

      <div className="flex flex-col w-full xl:w-1/2">
        <div className="flex flex-row justify-between">
          <h1 className="text-2xl font-semibold">
            Manage Funeral Arrangement Add-ons
          </h1>
          <Button onClick={addOnModal.onOpen}> Create Add on</Button>
        </div>
        <hr className="w-full my-3" />
        {isLoading ? (
          <div> Loading</div>
        ) : !data.length ? (
          <h1 className="text-primary">No add ons found</h1>
        ) : (
          <div className="flex flex-col gap-5">
            {data.map((add) => (
              <div
                className=" grid grid-cols-3 flex-row w-full justify-between  border-b pb-2 "
                key={add.id}
              >
                <h2 className="font-medium col-start-1">{add.name}</h2>
                <h2 className="col-start-2">{formatter.format(add.price)}</h2>
                <div className="flex flex-row gap-x-2 col-start-3 justify-end "></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AddOns;
