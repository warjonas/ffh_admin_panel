import { Arrangement, Removal } from '@/types';
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { formatter } from '@/lib/utils';
import { MoreHorizontal, View } from 'lucide-react';

interface PreviewInfoProps {
  data: Removal | Arrangement;
  preview: string;
  onReceiptOpen: (receiptNo: string) => void;
}

const PreviewInfo = ({ data, preview, onReceiptOpen }: PreviewInfoProps) => {
  return (
    <section className="flex flex-col">
      <div className="flex flex-col gap-y-2">
        <h1 className="font-semibold">
          Full Name:&nbsp;
          <span className="font-normal">
            {data?.deceased.firstNames + ' ' + data?.deceased.lastName}
          </span>
        </h1>
        {/* <h1 className="font-semibold">
          Requested Date: &nbsp;
          <span className="font-normal">
            {data instanceof Removal
              ? format(new Date(data?.dateRequested), 'dd/MM/yyyy')
              : format(new Date(data?.created), 'dd/MM/yyyy')}
          </span>
        </h1> */}
        <h1 className="font-semibold">
          Total: &nbsp;
          <span className="font-normal">
            {formatter.format(data?.totalDue)}
          </span>
        </h1>
        <h1 className="font-semibold">
          Amount Due: &nbsp;
          <span className="font-normal">
            {formatter.format(data?.outstandingBalance)}
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
        {data?.receipts.map((receipt) => (
          <div
            className="w-full flex flex-row justify-between"
            key={receipt.id}
          >
            <div className="py-2 justify-between grid grid-cols-3 grid-flow-col w-full">
              <div className="col-span-1 col-start-1 flex flex-col">
                <p>{receipt?.receiptNo}</p>
              </div>
              <div className="col-span-1 col-start-2 flex flex-col">
                <p>{formatter.format(receipt.receivedAmount)}</p>
              </div>
              <div className="col-span-1 col-start-3 flex flex-col">
                <p>{receipt.methodOfPayment}</p>
              </div>
            </div>
            <div className="w-fit flex">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open Menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => onReceiptOpen(receipt.receiptNo)}
                  >
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
  );
};

export default PreviewInfo;
