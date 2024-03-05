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
import { Removal } from '@/types';
// import { Arrangement } from '@/types';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const RemovalReceiptModal = () => {
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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    data,
    error,
    isLoading,
  }: { data: Removal; error: any; isLoading: any } = useSWR(
    id ? `/api/removal/${id}` : null,
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
    documentTitle: `Deceased Details `,
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
      title={`Viewing Funeral Arrangement for: `}
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

export default RemovalReceiptModal;
