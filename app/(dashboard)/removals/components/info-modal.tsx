'use client';

import { useEffect, useRef, useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { PenBoxIcon, PrinterIcon, ReceiptIcon } from 'lucide-react';
import useSWR, { SWRConfiguration } from 'swr';
import { Arrangement } from '@/types';
import { format } from 'date-fns';
import generatePDF, { Margin, Resolution, usePDF } from 'react-to-pdf';

import { formatter } from '@/lib/utils';
import { Removal } from '@prisma/client';
import { useReactToPrint } from 'react-to-print';
import RemovalReceiptModal from './removalReceiptModal';
// import { Arrangement } from '@/types';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  id: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const InfoModal: React.FC<InfoModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  id,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const componentRef = useRef(null);
  const getPageMargins = () => {
    return `@page { margin: 0rem 2rem 0rem 2rem !important; }`;
  };

  const config: SWRConfiguration = {
    revalidateOnFocus: true,
  };

  const {
    data,
    error,
    isLoading,
  }: { data: Removal; error: any; isLoading: any } = useSWR(
    `/api/removal/${id}`,
    fetcher,
    config
  );

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Body Removal report - ${data?.firstName} ${data?.lastname}`,
  });

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
        isOpen={isOpen}
        onClose={onClose}
      >
        An error occurred whilte fetching the data.
      </Modal>
    );
  }

  if (isLoading) {
    return (
      <Modal title={`Loading`} description="" isOpen={isOpen} onClose={onClose}>
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
      title={`Viewing details for the removal of the late: ${data?.firstName} ${data?.lastname}`}
      description="A preview of the funeral program"
      isOpen={isOpen}
      onClose={onClose}
    >
      {isLoading && <p>Loading</p>}
      {data && (
        <>
          <Button onClick={handlePrint}>
            {' '}
            <PrinterIcon className="h-4 w-4 mr-2" /> Print/Save
          </Button>

          {/* <RemovalReceiptModal id={data.id} receipts={[]} onClose={() => {}} onConfirm={() => {}} isOpen={true} loading={false}  /> */}

          <section
            className="pt-2 space-x-2 flex items-center justify-end w-full flex-col h-fit pr-2"
            id="print-ref"
            ref={componentRef}
          >
            <style>{getPageMargins()}</style>
            <section className="w-full h-fit">
              <div className="mb-2 p-2">
                <h1 className="text-xl   text-center  uppercase">
                  Fortuin Funeral Home (PTY) LTD
                </h1>
                <h2 className="font-semibold text-lg text-center">
                  Body Removal Report
                </h2>
              </div>
            </section>

            <hr className="w-full border-secondary-foreground mb-5" />

            <section className="w-full h-fit border-2 border-secondary-foreground flex flex-col gap-y-2 p-2 mb-5">
              <div className="flex gap-x-10">
                <p className="font-semibold">
                  Surname:{' '}
                  <span className="font-normal"> {data?.firstName}</span>
                </p>{' '}
                <p className="font-semibold">
                  First Name(s):{' '}
                  <span className="font-normal"> {data?.lastname}</span>
                </p>
              </div>
              <p className="font-semibold">
                ID Number: <span className="font-normal">{data?.idNumber}</span>
              </p>
              <p className="font-semibold">
                Address: <span className="font-normal">{data?.address}</span>
              </p>
            </section>

            <section className="w-full h-fit">
              <div className="flex gap-x-20 mb-2">
                <p className="font-semibold">
                  Date Removed:{' '}
                  <span className="font-normal">
                    {' '}
                    {format(new Date(data?.dateRemoved), 'dd/MM/yyyy')}
                  </span>
                </p>
                <p className="font-semibold">
                  By Undertaker:{' '}
                  <span className="font-normal">{data?.byUndertaker}</span>
                </p>
              </div>

              <div className="">
                <div className="flex flex-col gap-y-2">
                  <h1 className="font-semibold text-lg">Removal</h1>
                  <div className="flex gap-x-10">
                    <p className="font-semibold">
                      Doctors Fees:{' '}
                      <span className="font-normal">
                        {' '}
                        {formatter.format(data?.doctorsFees)}
                      </span>
                    </p>
                    <p className="font-semibold">
                      Registration of Death:{' '}
                      <span className="font-normal">
                        {' '}
                        {formatter.format(data?.doctorsFees)}
                      </span>
                    </p>
                  </div>

                  <p className="font-semibold">
                    Storage @ {formatter.format(data?.storageFee)}/day x{' '}
                    {data?.storageDays} days -{' '}
                    <span className="font-normal">
                      {' '}
                      {formatter.format(
                        Number(data?.storageDays * data?.storageFee)
                      )}
                    </span>
                  </p>
                  <p className="font-semibold">
                    Copies @ {formatter.format(data?.copyFee)}/day x{' '}
                    {data?.copies} days -{' '}
                    <span className="font-normal">
                      {' '}
                      {formatter.format(Number(data?.copyFee * data?.copies))}
                    </span>
                  </p>
                  <p className="font-semibold">
                    Booking of Grave:{' '}
                    <span className="font-normal">
                      {' '}
                      {formatter.format(data?.graveFee)}
                    </span>
                  </p>
                  <p className="font-semibold">
                    Gravedigger Cost:{' '}
                    <span className="font-normal">
                      {' '}
                      {formatter.format(data?.gravediggerCost)}
                    </span>
                  </p>
                  <p className="font-semibold">
                    Admin Fees:{' '}
                    <span className="font-normal">
                      {' '}
                      {formatter.format(data?.adminFees)}
                    </span>
                  </p>

                  <h1 className="font-semibold text-xl">
                    Total Due before removal of the body:{' '}
                    {formatter.format(data.totalDue)}
                  </h1>

                  <p className=" border-4 border-secondary-foreground text-red-800 uppercase p-1 font-semibold mt-2">
                    WE DO NOT ACCEPT CASH AND FULL PAYMENT MUST BE MADE BEFORE
                    REMOVAL IS ALLOWED{' '}
                  </p>
                </div>
              </div>
            </section>
          </section>
          <div className="flex w-full justify-end gap-x-2 mt-5">
            <Button disabled={loading} variant={'outline'} onClick={onClose}>
              Close
            </Button>
            <Button disabled={loading} variant={'default'} onClick={onConfirm}>
              <PenBoxIcon /> Edit
            </Button>
          </div>
          <hr className="my-5 w-full" />
          <div className="flex flex-col w-full">
            <button
              className="self-end text-lg  flex items-center underline"
              onClick={() => {}}
            >
              <ReceiptIcon className="h-5 w-5 mr-2" /> Generate Receipt
            </button>
          </div>
        </>
      )}
    </Modal>
  );
};
