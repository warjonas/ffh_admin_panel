'use client';

import { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { PenBoxIcon, PrinterIcon } from 'lucide-react';
import { FuneralProgramColumn } from './columns';
import useSWR, { SWRConfiguration } from 'swr';
import { Arrangement } from '@/types';
import { format } from 'date-fns';
import generatePDF, { Margin, Resolution, usePDF } from 'react-to-pdf';

import { formatter } from '@/lib/utils';
import { FuneralProgram } from '@prisma/client';
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
  const config: SWRConfiguration = {
    revalidateOnFocus: true,
  };
  const {
    data,
    error,
    isLoading,
  }: { data: FuneralProgram; error: any; isLoading: any } = useSWR(
    `/api/program/${id}`,
    fetcher,
    config
  );

  const { toPDF, targetRef } = usePDF({
    filename: `Funeral Program for ${data?.firstNameOfDeceased} ${data?.lastNameOfDeceased}.pdf`,
  });

  // const arrangement = await getArrangement(data)

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  if (error)
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

  if (isLoading)
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

  const onPrint = () => {
    const element = document.getElementById('print-ref');

    element && element.classList.add('w-screen');

    element &&
      generatePDF(targetRef, {
        method: 'open',

        resolution: Resolution.HIGH,
        page: {
          margin: Margin.MEDIUM,

          format: 'A4',

          orientation: 'portrait',
        },
        canvas: {
          mimeType: 'image/png',
          qualityRatio: 1,
        },

        overrides: {
          pdf: {
            compress: true,
          },

          canvas: {
            useCORS: true,
          },
        },
      });

    element && element.classList.remove('w-screen');
  };

  return (
    <Modal
      title={`Viewing Funeral Program for: ${data?.firstNameOfDeceased} ${data?.lastNameOfDeceased}`}
      description="A preview of the funeral program"
      isOpen={isOpen}
      onClose={onClose}
    >
      {isLoading && <p>Loading</p>}
      {data && (
        <>
          <Button onClick={() => onPrint()}>
            {' '}
            <PrinterIcon className="h-4 w-4" /> Print PDF
          </Button>

          <section
            className="pt-2 space-x-2 flex items-center justify-end w-full flex-col h-fit"
            id="print-ref"
            ref={targetRef}
          >
            <section className="w-full h-fit">
              <div className="mb-2 p-2">
                <h1 className="text-xl   text-center  uppercase">
                  Fortuin Funeral Home (PTY) LTD
                </h1>
                <h2 className="font-semibold text-lg text-center">
                  Funeral Program Preview
                </h2>
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
        </>
      )}
    </Modal>
  );
};
