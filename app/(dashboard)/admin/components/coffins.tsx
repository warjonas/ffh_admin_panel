'use client';

import { AlertModal } from '@/components/modals/alert-modal';
import { Button } from '@/components/ui/button';
import { useCoffinModal } from '@/hooks/use-deceased-modal';
import { formatter } from '@/lib/utils';
import { Coffin } from '@/types';
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

const Coffins = (props: Props) => {
  const addCoffinModal = useCoffinModal();
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
  }: { data: Coffin[]; error: any; isLoading: any } = useSWR(
    `/api/coffin`,
    fetcher,
    config
  );

  const onEdit = (id: string) => {
    const query: QueryProps[] = [{ name: 'coffinId', value: id }];

    router.push(pathname + '?' + createQueryString(query) + '#coffins');
    addCoffinModal.onOpen();
  };

  const onDelete = async (id: string) => {
    try {
      setLoading(true);
      await axios.delete(`/api/coffin/${id}`);
      router.refresh();
      toast.success('Coffin has been deleted');
    } catch (error) {
      toast.error('Internal Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full flex flex-row">
      {/* list of coffins */}

      <div className="flex flex-col w-1/2">
        <div className="flex flex-row justify-between">
          <h1 className="text-2xl font-semibold">Manage Coffins</h1>
          <Button onClick={addCoffinModal.onOpen}> Add new coffin</Button>
        </div>
        <hr className="w-full my-3" />
        {isLoading ? (
          <div> Loading</div>
        ) : (
          <div className="flex flex-col gap-5">
            {data.map((coffin) => (
              <div
                className=" grid grid-cols-3 flex-row w-full justify-between  border-b pb-2 "
                key={coffin.id}
              >
                <h2 className="font-medium col-start-1">{coffin.coffinName}</h2>
                <h2 className="col-start-2">
                  {formatter.format(coffin.price)}
                </h2>
                <div className="flex flex-row gap-x-2 col-start-3 justify-end ">
                  {coffin.coffinName !== 'None' && (
                    <>
                      <Pencil
                        className="h-6 w-6 p-1 bg-blue-900 text-background rounded-full  hover:cursor-pointer"
                        onClick={() => onEdit(coffin.id)}
                      />
                      <X
                        className="h-6 w-6 bg-red-900 text-background rounded-full col-start-7 justify-center hover:cursor-pointer"
                        onClick={() => onDelete(coffin.id)}
                      />
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

export default Coffins;
