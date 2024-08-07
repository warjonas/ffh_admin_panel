'use client';

import { AlertModal } from '@/components/modals/alert-modal';
import { Button } from '@/components/ui/button';
import { useCoffinModal, useVehicleModal } from '@/hooks/use-deceased-modal';
import { formatter } from '@/lib/utils';
import { Coffin, Vehicle } from '@/types';
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

const Vehicles = (props: Props) => {
  const addVehicleModal = useVehicleModal();
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
  }: { data: Vehicle[]; error: any; isLoading: any } = useSWR(
    `/api/vehicle`,
    fetcher,
    config
  );

  const onEdit = (id: string) => {
    const query: QueryProps[] = [{ name: 'vehicleId', value: id }];

    router.push(pathname + '?' + createQueryString(query) + '#vehicles');
    addVehicleModal.onOpen();
  };

  const onDelete = async (id: string) => {
    try {
      setLoading(true);
      await axios.delete(`/api/vehicle/${id}`);
      router.refresh();
      toast.success('Vehicle has been deleted');
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
          <h1 className="text-2xl font-semibold">Manage Vehicles</h1>
          <Button onClick={addVehicleModal.onOpen}> Add new Vehicle</Button>
        </div>
        <hr className="w-full my-3" />
        {isLoading ? (
          <div> Loading</div>
        ) : (
          <div className="flex flex-col gap-5">
            {data?.map((vehicle) => (
              <div
                className=" grid grid-cols-3 flex-row w-full justify-between  border-b pb-2 "
                key={vehicle.id}
              >
                <h2 className="font-medium col-start-1">
                  {vehicle.registration}
                </h2>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Vehicles;
