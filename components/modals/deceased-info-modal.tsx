'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { PenBoxIcon, PrinterIcon } from 'lucide-react';
import { getArrangement } from '@/actions/getArrangement';
import useSWR, { SWRConfiguration } from 'swr';
import { format } from 'date-fns';
import generatePDF, { Margin, Resolution, usePDF } from 'react-to-pdf';

import { useReactToPrint } from 'react-to-print';

import { formatter } from '@/lib/utils';
import { Deceased } from '@prisma/client';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  useDeceasedInfoModal,
  useDeceasedModal,
} from '@/hooks/use-deceased-modal';
import { useRouter } from 'next/navigation';
// import { Arrangement } from '@/types';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const InfoModal = () => {
  const [isMounted, setIsMounted] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const id = searchParams.get('deceasedId');
  const infoModal = useDeceasedInfoModal();
  const deceasedModal = useDeceasedModal();

  const config: SWRConfiguration = {
    revalidateOnMount: true,
  };

  const getPageMargins = () => {
    return `@page { margin: 3rem 2rem 3rem 2rem !important; }`;
  };

  const componentRef = useRef(null);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  // const arrangement = await getArrangement(data)

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    data,
    error,
    isLoading,
  }: { data: Deceased; error: any; isLoading: any } = useSWR(
    `/api/deceased/${id}`,
    fetcher,
    config
  );

  const onConfirm = async () => {
    router.push(pathname + '?' + createQueryString('deceasedId', data.id));

    deceasedModal.onOpen();

    infoModal.onClose();
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Deceased Details - ${data?.firstNames} ${data?.lastName}`,
  });

  if (!isMounted) {
    return null;
  }

  if (error)
    return (
      <Modal
        title={`Error Occurred`}
        description=""
        isOpen={infoModal.isOpen}
        onClose={infoModal.onClose}
      >
        An error occurred while fetching the data.
      </Modal>
    );

  if (isLoading)
    return (
      <Modal
        title={`Loading`}
        description=""
        isOpen={infoModal.isOpen}
        onClose={infoModal.onClose}
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

  return (
    <Modal
      title={`Viewing Funeral Arrangement for: ${data?.firstNames} ${data?.lastName}`}
      description="A preview of the funeral arrangement"
      isOpen={infoModal.isOpen}
      onClose={infoModal.onClose}
    >
      {isLoading && <p>Loading</p>}
      {data && (
        <>
          <Button onClick={handlePrint}>
            {' '}
            <PrinterIcon className="h-4 w-4 mr-2" /> Print/Save
          </Button>

          <section
            className="pt-2 space-x-2 flex items-center justify-end w-full flex-col h-fit"
            id="print-ref"
            ref={componentRef}
          >
            <style> {getPageMargins()}</style>
            <section className="w-full h-fit">
              <div className="mb-2 p-2">
                <h1 className="text-xl   text-center  uppercase">
                  Fortuin Funeral Home (PTY) LTD
                </h1>
                <h2 className="font-semibold text-lg text-center">
                  Deceased Details{' '}
                </h2>
              </div>

              <h2 className="my-2"> Created by: {data?.createdBy}</h2>

              <div className="w-full flex flex-col gap-y-1">
                <h2 className="bg-blue-200 p-1 mb-1 text-center font font-semibold border-b uppercase border-black">
                  Details of the Deceased
                </h2>
                <p className="font-semibold">
                  Fortuin Funeral Home Member No.:{' '}
                  <span className="font-normal">{data?.ffhMemberNo}</span>
                </p>
                <p className="font-semibold">
                  ID Number:{' '}
                  <span className="font-normal">{data?.idNumber}</span>
                </p>
                <p className="font-semibold">
                  Date Of Birth:{' '}
                  <span className="font-normal">
                    {format(new Date(data.dateOfBirth), 'MM/dd/yyyy')}
                  </span>
                </p>
                <p className="font-semibold">
                  Date Of Death:{' '}
                  <span className="font-normal">
                    {format(new Date(data.dateOfDeath), 'MM/dd/yyyy')}
                  </span>
                </p>
                <div className="flex flex-row gap-x-2">
                  <p className="font-semibold">
                    First Name(s):{' '}
                    <span className="font-normal"> {data.firstNames}</span>
                  </p>
                  <p className="font-semibold">
                    Last Name:{' '}
                    <span className="font-normal"> {data.lastName}</span>{' '}
                  </p>
                </div>
                <p className="font-medium">
                  Removal Date:{' '}
                  {format(new Date(data.removalDate), 'MM/dd/yyyy')}
                </p>
                <p className="font-semibold">
                  Removal From:{' '}
                  <span className="font-normal">
                    {data.removalFrom.street}, {data.removalFrom.city},{' '}
                    {data.removalFrom.province}, {data.removalFrom.zip}
                  </span>
                </p>
                <p className="font-semibold">
                  Removal Time: <span className="font-normal">11am</span>{' '}
                </p>
              </div>
            </section>
          </section>
          <div className="flex w-full justify-end gap-x-2 mt-5">
            <Button
              disabled={isLoading}
              variant={'default'}
              onClick={onConfirm}
            >
              <PenBoxIcon /> Edit
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
};
