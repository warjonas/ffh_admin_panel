'use client';

import { useRemovalReceiptModal } from '@/hooks/use-removal-modal';
import { formatter } from '@/lib/utils';
import { Arrangement, Removal } from '@/types';
import { format } from 'date-fns';
import { MoreHorizontal, View } from 'lucide-react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React, { useCallback } from 'react';
import useSWR, { SWRConfiguration } from 'swr';
import PreviewInfo from './preview-info';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface DataPreviewProps {
  heading: string;
}

const DataPreview = ({ heading }: DataPreviewProps) => {
  const searchParams = useSearchParams();
  const receiptModal = useRemovalReceiptModal();
  const router = useRouter();
  const pathname = usePathname();

  const removalId = searchParams.get('removalId');
  const arrangementId = searchParams.get('arrangementId');

  const preview = searchParams.get('preview');

  const config: SWRConfiguration = {
    revalidateOnFocus: true,
  };

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const {
    data: removalData,
    error: removalError,
    isLoading: removalIsLoading,
  }: { data: Removal; error: any; isLoading: any } = useSWR(
    removalId && preview === 'removal' ? `/api/removal/${removalId}` : null,
    fetcher,
    config
  );

  const {
    data: arrangementData,
    error: arrangementError,
    isLoading: arrangementIsLoading,
  }: { data: Arrangement; error: any; isLoading: any } = useSWR(
    arrangementId && preview === 'arrangement'
      ? `/api/arrangement/${arrangementId}`
      : null,
    fetcher,
    config
  );

  const onReceiptOpen = (receiptNo: string) => {
    receiptModal.onOpen();
    router.push(pathname + '?' + createQueryString('receiptNo', receiptNo));

    if (preview === 'removal') {
      if (!removalId) {
        router.push(
          pathname + '?' + createQueryString('removalId', removalData.id)
        );
      }
    } else {
      if (!arrangementId) {
        router.push(
          pathname +
            '?' +
            createQueryString('arrangementId', arrangementData.id)
        );
      }
    }
  };

  if (preview === null) {
    return (
      <section className="p-5 w-full h-2/3 border shadow-sm rounded-md">
        <div className=" h-full w-full justify-center items-center text-center ">
          <h2 className="text-xl font-semibold">{heading}</h2>
          <hr className="w-full my-2" />
          <h1 className="font-semibold text-slate-300">
            Please select a record on the left to preview.
          </h1>
        </div>
      </section>
    );
  }

  if (removalIsLoading && preview === 'removal') {
    return (
      <div className="w-full flex items-center h-full justify-center">
        <div
          className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  if (arrangementIsLoading && preview === 'arrangement') {
    return (
      <div className="w-full flex items-center h-full justify-center">
        <div
          className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  console.log('data', arrangementData);

  return (
    <section className="p-5 w-full h-2/3 border shadow-sm rounded-md">
      <h2 className="text-xl font-semibold">{heading}</h2>
      <hr className="w-full my-2" />

      {removalData && (
        <PreviewInfo
          data={removalData}
          onReceiptOpen={onReceiptOpen}
          preview={preview}
        />
      )}

      {arrangementData && (
        <PreviewInfo
          data={arrangementData}
          onReceiptOpen={onReceiptOpen}
          preview={preview}
        />
      )}
    </section>
  );
};

export default DataPreview;
