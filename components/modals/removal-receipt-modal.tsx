'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { PrinterIcon } from 'lucide-react';
import useSWR, { SWRConfiguration } from 'swr';
import { format } from 'date-fns';
import generatePDF, { Margin, Resolution, usePDF } from 'react-to-pdf';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useReactToPrint } from 'react-to-print';
import { usePathname, useSearchParams } from 'next/navigation';

import Logo from '@/assets/Logo.png';
import { getArrangement } from '@/actions/getArrangement';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { formatter } from '@/lib/utils';
import { Deceased } from '@prisma/client';
import {
  useDeceasedInfoModal,
  useDeceasedModal,
} from '@/hooks/use-deceased-modal';
import { Removal, RemovalReceipt } from '@/types';
import { useRemovalReceiptModal } from '@/hooks/use-removal-modal';

// import { Arrangement } from '@/types';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const RemovalReceiptModal = () => {
  const [isMounted, setIsMounted] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const id = searchParams.get('removalId');
  const receiptNo = searchParams.get('receiptNo');
  const preview = searchParams.get('preview');
  const receiptModal = useRemovalReceiptModal();

  const config: SWRConfiguration = {
    revalidateOnMount: true,
  };

  const getPageMargins = () => {
    return `@page { margin: 2rem 2rem 2rem 2rem !important; }`;
  };

  const componentRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    data,
    error,
    isLoading,
  }: { data: RemovalReceipt; error: any; isLoading: any } = useSWR(
    receiptNo ? `/api/receipt/${receiptNo}` : null,
    fetcher,
    config
  );

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Receipt - ${receiptNo} `,
  });

  if (!isMounted) {
    return null;
  }

  const onClose = () => {
    router.back();
    receiptModal.onClose();
  };

  if (error)
    return (
      <Modal
        title={`Error Occurred`}
        description=""
        isOpen={receiptModal.isOpen}
        onClose={onClose}
      >
        An error occurred while fetching the data.
      </Modal>
    );

  if (isLoading)
    return (
      <Modal
        title={`Loading`}
        description=""
        isOpen={receiptModal.isOpen}
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

  return (
    <Modal
      title={`Viewing Payment receipt for: ${
        preview === 'removal'
          ? data?.removal?.deceased.firstNames +
            ' ' +
            data?.removal?.deceased.lastName
          : data?.arrangement?.deceased.firstNames +
            ' ' +
            data?.arrangement?.deceased.lastName
      } `}
      description="A preview of payment"
      isOpen={receiptModal.isOpen}
      onClose={onClose}
    >
      {isLoading && <p>Loading</p>}
      {data && (
        <>
          <Button onClick={handlePrint}>
            {' '}
            <PrinterIcon className="h-4 w-4 mr-2" /> Print/Save
          </Button>
          <hr className="w-full my-5" />

          <section
            className="pt-2 flex items-center justify-end w-full flex-col h-fit font-serif"
            id="print-ref"
            ref={componentRef}
          >
            <style> {getPageMargins()}</style>
            <header className="grid grid-cols-2 gap-x-2 w-full">
              <div className="col-start-1 flex flex-col gap-y-1">
                <h1 className="text-2xl font-medium ">Fortuin Funeral Home</h1>
                <p>
                  <span className="font-semibold">Address:</span> <br /> 88
                  Laurence Erasmus Dr <br /> Bethelsdorp <br /> Port Elizabeth{' '}
                  <br /> 6059
                </p>
                <p className="font-semibold">
                  Tel: <br />
                  <span className="font-normal"> +27 82 956 6413</span>
                </p>
                <p className="font-semibold">
                  {' '}
                  Website: <br />
                  <span className="font-normal">
                    {' '}
                    www.fortuinfuneralhome.co.za
                  </span>
                </p>
              </div>
              <div className="col-start-2 flex flex-col h-full">
                <Image
                  src={Logo}
                  height={1080}
                  width={1920}
                  className="h-40 w-64"
                  alt="Logo"
                />
              </div>
            </header>
            <hr className="w-full my-5" />

            <section className="w-full flex flex-col gap-y-5">
              {/* Customer Details section */}
              <div className="flex flex-col text-center">
                <h2 className="mb-2 text-lg text-slate-500">Customer</h2>
                <div className="grid grid-cols-3 w-full">
                  <div className="col-start-1">
                    <h2 className="text-left mb-2 font-semibold">Payee</h2>

                    <p className="text-left">
                      <span className="font-semibold">
                        Full Name: <br />{' '}
                      </span>
                      {data?.receivedFrom}
                    </p>
                  </div>
                  <div className="col-start-2">
                    <h2 className="text-left mb-2 font-semibold">Late</h2>
                    <p className="text-left">
                      {' '}
                      <span className="font-semibold">Full Name: </span>
                      {preview === 'removal'
                        ? data?.removal?.deceased.firstNames +
                          ' ' +
                          data?.removal?.deceased.lastName
                        : data?.arrangement?.deceased.firstNames +
                          ' ' +
                          data?.arrangement?.deceased.lastName}
                    </p>
                    <p className="text-left">
                      {' '}
                      <span className="font-semibold">ID Number: </span>
                      {preview === 'removal'
                        ? data?.removal?.deceased.idNumber
                        : data?.arrangement?.deceased.idNumber}
                    </p>
                    <p className="text-left">
                      {' '}
                      <span className="font-semibold">Date of Death: </span>
                      {preview === 'removal'
                        ? format(
                            new Date(
                              data.removal
                                ? data.removal.deceased.dateOfDeath
                                : new Date()
                            ),
                            'dd/MM/yyyy'
                          )
                        : format(
                            new Date(
                              data.arrangement
                                ? data.arrangement.deceased.dateOfDeath
                                : new Date()
                            ),
                            'dd/MM/yyyy'
                          )}
                    </p>
                  </div>
                  <div className="col-start-3">
                    <h2 className="text-left mb-2 font-semibold">
                      Invoice Details
                    </h2>
                    <p className="text-left">
                      {' '}
                      <span className="font-semibold">Invoice Date: </span>
                      {format(new Date(data.date), 'dd/MM/yyyy')}
                    </p>
                    <p className="text-left">
                      {' '}
                      <span className="font-semibold">Invoice No.: </span>
                      {preview === 'removal'
                        ? data?.removal?.invoiceNo
                        : data?.arrangement?.invoiceNo}
                    </p>
                    <p className="text-left">
                      {' '}
                      <span className="font-semibold">Invoice Total: </span>
                      {preview === 'removal'
                        ? formatter.format(
                            data.removal ? data.removal.totalDue : 0
                          )
                        : formatter.format(
                            data.arrangement ? data.arrangement.totalDue : 0
                          )}
                    </p>

                    <p className="text-left">
                      {' '}
                      <span className="font-semibold">Outstanding: </span>
                      {preview === 'removal'
                        ? formatter.format(
                            data.removal ? data.removal.outstandingBalance : 0
                          )
                        : formatter.format(
                            data.arrangement
                              ? data.arrangement.outstandingBalance
                              : 0
                          )}
                    </p>
                  </div>
                </div>
              </div>

              <hr className="w-full" />

              {/* Receipt Details section */}

              <div className="flex flex-col text-center">
                <h2 className="mb-5 text-lg text-slate-500">
                  Receipt: {receiptNo}
                </h2>
                <table className="table-auto w-full border border-black">
                  <thead className="border-b border-black ">
                    <tr className="">
                      <th className="border border-black">Date Of Receipt</th>
                      <th className="border border-black">Payee</th>
                      <th className="border border-black">Payment Method</th>
                      <th className="border border-black">Receipt No.</th>
                      <th className="border border-black">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="">
                    <tr className="">
                      <td>{format(new Date(data?.date), 'dd/MM/yyy')}</td>
                      <td>{data.receivedFrom}</td>
                      <td>{data.methodOfPayment}</td>
                      <td>{data.receiptNo}</td>
                      <td>{formatter.format(data.receivedAmount)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <footer className="mt-5 flex flex-col">
              <h2 className="text-2xl font-medium text-left my-5">
                Thank your for your payment
              </h2>

              <div className="grid grid-cols-3 justify-between p-2 border border-black">
                <p className="col-start-1 text-sm">
                  {' '}
                  <span className="font-semibold text-lg">
                    Fortuin Funeral Home
                  </span>{' '}
                  <br /> An Extended Member of Your Family
                </p>

                <p className="col-start-2">
                  www.fortuinfunerlhome.co.za <br />
                  <span className="font-medium">Tel.:</span> +27 82 956 6413
                </p>

                <p className="col-start-3">
                  While you are taking care of Today, your Fortuin Funeral Home
                  Family is Taking care of Tomorrow.
                </p>
              </div>
            </footer>
          </section>
        </>
      )}
    </Modal>
  );
};

export default RemovalReceiptModal;
