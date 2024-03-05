'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatter } from '@/lib/utils';
import { Removal } from '@/types';
import { format } from 'date-fns';
import { MoreHorizontal, View } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import useSWR, { SWRConfiguration } from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const RemovalPreview = () => {
  const searchParams = useSearchParams();

  const id = searchParams.get('removalId');
  const preview = searchParams.get('preview');

  const config: SWRConfiguration = {
    revalidateOnFocus: true,
  };

  const {
    data,
    error,
    isLoading,
  }: { data: Removal; error: any; isLoading: any } = useSWR(
    id && preview ? `/api/removal/${id}` : null,
    fetcher,
    config
  );

  return (
    <section className="p-5 w-full h-2/3 border shadow-sm rounded-md">
      <h2 className="text-xl font-semibold">Deceased Removal Preview</h2>
      <hr className="w-full my-2" />
      {!data && !isLoading && (
        <div className=" h-full w-full justify-center items-center text-center ">
          <h1 className="font-semibold text-slate-300">
            Please select a record on the left to preview.
          </h1>
        </div>
      )}

      {isLoading && (
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
      )}

      {data && (
        <>
          <section className="flex flex-col">
            <div className="flex flex-col gap-y-2">
              <h1 className="font-semibold">
                Full Name:&nbsp;
                <span className="font-normal">
                  {data.deceased.firstNames + ' ' + data.deceased.lastName}
                </span>
              </h1>
              <h1 className="font-semibold">
                Requested Date: &nbsp;
                <span className="font-normal">
                  {format(new Date(data.dateRequested), 'dd/MM/yyyy')}
                </span>
              </h1>
              <h1 className="font-semibold">
                Total: &nbsp;
                <span className="font-normal">
                  {formatter.format(data.totalDue)}
                </span>
              </h1>
              <h1 className="font-semibold">
                Amount Due: &nbsp;
                <span className="font-normal">
                  {formatter.format(data.outstandingBalance)}
                </span>
              </h1>
            </div>
            <hr className="w-full my-5" />
            <div className="flex flex-col">
              <h2 className="font-semibold text-lg mb-2">Payments</h2>
              <div className="justify-between grid grid-cols-3">
                <div className="col-span-1 col-start-1 flex flex-col">
                  <h2 className="font-semibold">Receipt No.</h2>
                </div>
                <div className="col-span-1 col-start-2 flex flex-col">
                  <h2 className="font-semibold">Amount</h2>
                </div>
                <div className="col-span-1 col-start-3 flex flex-col">
                  <h2 className="font-semibold">Method</h2>
                </div>
              </div>
              {data.receipts.map((receipt) => (
                <div
                  key={receipt.id}
                  className="py-2 justify-between grid grid-cols-[repeat(4, minmax(1fr,2fr))] grid-flow-col"
                >
                  <div className="col-span-1 col-start-1 flex flex-col">
                    <p>{receipt?.receiptNo}</p>
                  </div>
                  <div className="col-span-1 col-start-2 flex flex-col">
                    <p>{formatter.format(receipt.receivedAmount)}</p>
                  </div>
                  <div className="col-span-1 col-start-3 flex flex-col">
                    <p>{receipt.methodOfPayment}</p>
                  </div>
                  <div className="col-span-1 col-start-4 justify-end  flex">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open Menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {}}>
                          <View className="mr-2 h-4 w-4" />
                          View Receipt
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </section>
  );
};

export default RemovalPreview;
