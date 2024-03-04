'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Modal } from '@/components/ui/modal';

import useSWR, { SWRConfiguration } from 'swr';

import { useUpcomingRemovalsModal } from '@/hooks/use-removal-modal';
import { Removal } from '@/types';
import { format } from 'date-fns';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const UpcomingRemovalsModal = () => {
  const [isMounted, setIsMounted] = useState(false);

  const removalsModal = useUpcomingRemovalsModal();

  const config: SWRConfiguration = {
    revalidateOnFocus: true,
  };

  const {
    data,
    error,
    isLoading,
  }: { data: Removal[]; error: any; isLoading: any } = useSWR(
    isMounted ? '/api/removal/upcoming' : null,
    fetcher,
    config
  );

  const onConfirm = async () => {
    // console.log(pathname + '?' + createQueryString('deceasedId', data.id));
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
        isOpen={removalsModal.isOpen}
        onClose={removalsModal.onClose}
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
        isOpen={removalsModal.isOpen}
        onClose={removalsModal.onClose}
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
      title={`Removals scheduled for this week.
      `}
      description="Upcoming removals"
      isOpen={removalsModal.isOpen}
      onClose={removalsModal.onClose}
    >
      {data.map((removal) => {
        return (
          <div className="p-3 rounded-lg shadow-md border border-solid grid grid-cols-3">
            <div className="col-start-1 col-span-1 flex flex-col gap-y-2">
              <h2 className="font-semibold">Full Name</h2>
              <p>
                {removal.deceased.firstNames} {removal.deceased.lastName}
              </p>
            </div>
            <div className="col-start-2 col-span-1 flex flex-col gap-y-2">
              <h2 className="font-semibold">Scheduled For</h2>
              <p>{format(new Date(removal.dateRequested), 'dd/MM/yyyy')}</p>
            </div>
            <div className="flex flex-col gap-y-2">
              <h2 className="font-semibold">Paid</h2>
              <p className="text-white bg-red-700 p-1 w-fit rounded shadow-md">
                Unpaid
              </p>
            </div>
          </div>
        );
      })}
    </Modal>
  );
};
