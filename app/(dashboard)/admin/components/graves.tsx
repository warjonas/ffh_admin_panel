'use client';

import { Button } from '@/components/ui/button';
import { useCoffinModal, useGraveModal } from '@/hooks/use-deceased-modal';
import { formatter } from '@/lib/utils';
import { Coffin, Grave } from '@/types';
import axios from 'axios';
import { Pencil, X } from 'lucide-react';
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

const Graves = (props: Props) => {
  const addGraveModal = useGraveModal();
  const [alertOpen, setAlertOpen] = useState(false);
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
  };

  const {
    data,
    error,
    isLoading,
  }: { data: Grave[]; error: any; isLoading: any } = useSWR(
    `/api/grave`,
    fetcher,
    {
      refreshInterval: 800,
    }
  );

  const onEdit = (id: string) => {
    const query: QueryProps[] = [{ name: 'graveId', value: id }];

    router.push(pathname + '?' + createQueryString(query) + '#graves');
    addGraveModal.onOpen();
  };

  const onDelete = async (id: string) => {
    try {
      setLoading(true);
      await axios.delete(`/api/grave/${id}`);
      router.refresh();
      toast.success('Grave has been deleted');
    } catch (error) {
      toast.error('Internal Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full flex flex-row">
      {/* list of graves */}

      <div className="flex flex-col w-1/2">
        <div className="flex flex-row justify-between">
          <h1 className="text-2xl font-semibold">Manage Gravesites</h1>
          <Button onClick={addGraveModal.onOpen}> Add new grave site</Button>
        </div>
        <hr className="w-full my-3" />
        {isLoading ? (
          <div> Loading</div>
        ) : (
          <div className="flex flex-col gap-5">
            {data ? (
              data.map((grave) => (
                <div
                  className=" grid grid-cols-3 flex-row w-full justify-between  border-b pb-2 "
                  key={grave.id}
                >
                  <h2 className="font-medium col-start-1">{grave.graveName}</h2>

                  <h2 className="col-start-2">
                    {formatter.format(grave.price)}
                  </h2>

                  <div className="flex flex-row gap-x-2 col-start-3 justify-end ">
                    {grave.graveName !== 'None' && (
                      <>
                        <Pencil
                          className="h-6 w-6 p-1 bg-blue-900 text-background rounded-full  hover:cursor-pointer"
                          onClick={() => onEdit(grave.id)}
                        />
                        <X
                          className="h-6 w-6 bg-red-900 text-background rounded-full col-start-7 justify-center hover:cursor-pointer"
                          onClick={() => onDelete(grave.id)}
                        />
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <h2 className="text-black">No Gravesites available</h2>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Graves;
