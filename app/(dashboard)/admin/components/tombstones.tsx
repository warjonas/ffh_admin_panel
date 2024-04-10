'use client';

import { AlertModal } from '@/components/modals/alert-modal';
import { Button } from '@/components/ui/button';
import { useCoffinModal, useTombstoneModal } from '@/hooks/use-deceased-modal';
import { formatter } from '@/lib/utils';
import { Coffin, Tombstone } from '@/types';
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

const Tombstones = (props: Props) => {
  const addTombstoneModal = useTombstoneModal();
  const [alertOpen, setAlertOpen] = useState(false);
  const [loading, setLoading] = useState(false);

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
  }: { data: Tombstone[]; error: any; isLoading: any } = useSWR(
    `/api/tombstone`,
    fetcher,
    config
  );

  const onEdit = (id: string) => {
    const query: QueryProps[] = [{ name: 'tombstoneId', value: id }];

    router.push(pathname + '?' + createQueryString(query) + '#tombstones');
    addTombstoneModal.onOpen();
  };

  const onDelete = async (id: string) => {
    try {
      setLoading(true);
      await axios.delete(`/api/tombstone/${id}`);
      router.refresh();
      toast.success('Tombstone has been deleted');
    } catch (error) {
      toast.error('Internal Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full flex flex-row">
      {/* list of tombstones */}

      <div className="flex flex-col w-1/2">
        <div className="flex flex-row justify-between">
          <h1 className="text-2xl font-semibold">Manage Tombstones</h1>
          <Button onClick={addTombstoneModal.onOpen}> Add new tombstone</Button>
        </div>
        <hr className="w-full my-3" />
        {isLoading ? (
          <div> Loading</div>
        ) : (
          <div className="flex flex-col gap-5">
            {data.map((tombstone) => (
              <div
                className=" grid grid-cols-4 flex-row w-full justify-between  border-b pb-2 "
                key={tombstone.id}
              >
                <h2 className="font-medium col-start-1">{tombstone.type}</h2>

                <h2 className="font-medium col-start-2">
                  {tombstone.tombstoneName}
                </h2>
                <h2 className="col-start-3">
                  {formatter.format(tombstone.price)}
                </h2>
                <div className="flex flex-row gap-x-2 col-start-4 justify-end ">
                  {tombstone.type !== 'None' && (
                    <>
                      <Pencil
                        className="h-6 w-6 p-1 bg-blue-900 text-background rounded-full  hover:cursor-pointer"
                        onClick={() => onEdit(tombstone.id)}
                      />
                      <button
                        onClick={() => onDelete(tombstone.id)}
                        disabled={loading}
                      >
                        <X className="h-6 w-6 bg-red-900 text-background rounded-full col-start-7 justify-center hover:cursor-pointer" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Tombstones;
