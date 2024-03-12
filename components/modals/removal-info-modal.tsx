'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { PenBoxIcon, PrinterIcon, ReceiptIcon } from 'lucide-react';
import useSWR, { SWRConfiguration } from 'swr';
import { Arrangement } from '@/types';
import { format } from 'date-fns';
import generatePDF, { Margin, Resolution, usePDF } from 'react-to-pdf';

import { formatter } from '@/lib/utils';
import { Removal } from '@/types';
import { useReactToPrint } from 'react-to-print';
import RemovalReceiptModal from './process-Payment-Modal';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  useRemovalInfoModal,
  useRemovalModal,
} from '@/hooks/use-removal-modal';
import { useProcessPaymentModal } from '@/hooks/use-payment-modal';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const RemovalInfoModal = () => {
  const [isMounted, setIsMounted] = useState(false);
  const componentRef = useRef(null);
  const searchParams = useSearchParams();
  const infoModal = useRemovalInfoModal();
  const removalModal = useRemovalModal();
  const paymentModal = useProcessPaymentModal();
  const pathname = usePathname();
  const router = useRouter();

  const id = searchParams.get('removalId');

  const getPageMargins = () => {
    return `@page { margin: 0rem 2rem 0rem 2rem !important; }`;
  };

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

  const processPayment = () => {
    router.push(
      pathname + '?' + createQueryString('deceasedId', data.deceased.id)
    );

    paymentModal.onOpen();

    infoModal.onClose();
  };

  const {
    data,
    error,
    isLoading,
  }: { data: Removal; error: any; isLoading: any } = useSWR(
    id ? `/api/removal/${id}` : null,
    fetcher,
    config
  );

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Body Removal report - ${
      data?.deceased.firstNames + ' ' + data?.deceased.lastName
    } `,
  });

  const onConfirm = async () => {
    // console.log(pathname + '?' + createQueryString('deceasedId', data.id));
    router.push(
      pathname + '?' + createQueryString('deceasedId', data.deceased.id)
    );

    removalModal.onOpen();

    infoModal.onClose();
  };

  const onClose = () => {
    if (id) {
      router.back();
    }
    infoModal.onClose();
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
        isOpen={infoModal.isOpen}
        onClose={onClose}
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
        isOpen={infoModal.isOpen}
        onClose={onClose}
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
      title={`Viewing details for the body removal of the late:  ${
        data?.deceased.firstNames + ' ' + data?.deceased.lastName
      }`}
      description="A preview of the body removal request."
      isOpen={infoModal.isOpen}
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
                <h2 className="mt-2"> Created by: {data?.scheduledBy}</h2>
              </div>
            </section>

            <hr className="w-full border-secondary-foreground mb-5" />

            <section className="w-full h-fit border-2 border-secondary-foreground flex flex-col gap-y-2 p-2 mb-5">
              <div className="flex gap-x-10">
                <p className="font-semibold">
                  Surname:{' '}
                  <span className="font-normal">
                    {' '}
                    {data?.deceased.lastName}
                  </span>
                </p>{' '}
                <p className="font-semibold">
                  First Name(s):{' '}
                  <span className="font-normal">
                    {' '}
                    {data?.deceased.firstNames}
                  </span>
                </p>
              </div>
              <p className="font-semibold">
                ID Number:{' '}
                <span className="font-normal">{data?.deceased.idNumber}</span>
              </p>
              <p className="font-semibold">
                Address:{' '}
                <span className="font-normal">
                  {data?.deceased.removalFrom.street}{' '}
                  {data?.deceased.removalFrom.city}
                </span>
              </p>
              <p className="font-semibold">
                Body removed by us on:{' '}
                <span className="font-normal">
                  {' '}
                  {format(new Date(data?.deceased.removalDate), 'dd/MM/yyyy')}
                </span>
              </p>
            </section>

            <section className="w-full h-fit">
              <div className="flex gap-x-20 mb-2">
                <p className="font-semibold">
                  Requested Removal Date:{' '}
                  <span className="font-normal">
                    {' '}
                    {format(new Date(data?.dateRequested), 'dd/MM/yyyy')}
                  </span>
                </p>
                <p className="font-semibold">
                  By Undertaker:{' '}
                  <span className="font-normal">{data?.byUndertaker}</span>
                </p>
              </div>

              <div className="">
                <div className="flex flex-col gap-y-2">
                  <h1 className="font-semibold text-lg">Removal Expenses</h1>
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
                    <span className="font-normal">
                      {' '}
                      {formatter.format(Number(data?.storage))}
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
            <Button variant={'outline'} onClick={onClose}>
              Close
            </Button>
            <Button variant={'default'} onClick={onConfirm}>
              <PenBoxIcon /> Edit
            </Button>
          </div>
          <hr className="my-5 w-full" />
          <div className="flex flex-col w-full">
            <button
              className="self-end text-lg  flex items-center underline"
              onClick={processPayment}
            >
              <ReceiptIcon className="h-5 w-5 mr-2" /> Process Payment
            </button>
          </div>
        </>
      )}
    </Modal>
  );
};
