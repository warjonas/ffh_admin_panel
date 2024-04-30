'use client';

import { useEffect, useRef, useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { PenBoxIcon, PrinterIcon } from 'lucide-react';
import useSWR, { SWRConfiguration } from 'swr';
import { Arrangement, Deceased } from '@/types';
import { format } from 'date-fns';
import generatePDF, { Margin, Resolution, usePDF } from 'react-to-pdf';
import Logo from '@/assets/Logo.png';

import { useReactToPrint } from 'react-to-print';

import { formatter } from '@/lib/utils';
import Image from 'next/image';
// import { Arrangement } from '@/types';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  id: string;
}

const calculate_days = (date1: Date, date2: Date) => {
  let timeDifference = date2.getTime() - date1.getTime();

  let days = Math.round(timeDifference / (1000 * 3600 * 24));

  return days;
};

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
  }: { data: Deceased; error: any; isLoading: any } = useSWR(
    `/api/deceased/${id}`,
    fetcher,
    config
  );

  const getPageMargins = () => {
    return `@page { margin: 3rem 2rem 3rem 2rem !important; }`;
  };

  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Invoice - ${data?.arrangement.invoiceNo}`,
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

  return (
    <Modal
      title={`Viewing Invoice for Funeral Arrangement: ${data?.firstNames} ${data?.lastName}`}
      description="A preview of the funeral arrangement"
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

          <section
            className="pt-2 space-x-2 flex items-center justify-end w-full flex-col h-fit"
            id="print-ref"
            ref={componentRef}
          >
            <style> {getPageMargins()}</style>

            <section className="w-full px-5">
              <div className="grid grid-col-2">
                <div className="flex col-start-1">
                  <Image
                    alt="Logo"
                    src={Logo}
                    width={1920}
                    height={1080}
                    className="w-60 h-40"
                  />
                </div>

                <div className="flex col-start-2 flex-col text-right">
                  <h1 className="font- font-serif text-2xl mb-3">
                    Fortuin Funeral Home
                  </h1>
                  <p className="text-right">
                    88 Laurence Erasmus Dr <br /> Bethelsdorp
                    <br /> Gqebertha
                    <br /> 6059
                  </p>
                </div>
              </div>
            </section>

            <hr className="w-full my-2 border-t-2 border border-gray-300" />

            <section className="w-full">
              <div className="grid grid-col-4">
                <div className="col-start-1" />

                <div className="flex col-start-2"></div>

                <div className="flex flex-col col-start-3 text-right">
                  <h1 className="font-semibold text-xl mb-3">Deceased</h1>
                  <p className="text-right">
                    {data.firstNames} {data.lastName}
                    <br /> {data.removalFrom.street}
                    <br /> {data.removalFrom.city}
                  </p>
                </div>

                <div className="col-start-4" />
              </div>
            </section>

            <section className="flex w-full pl-50">
              <h1 className="text-3xl font-medium">
                {data.arrangement.invoiceNo}
              </h1>
            </section>

            <section className="w-full  my-5">
              <div className="grid grid-cols-4">
                <div className="col-start-1 col-span-2">
                  <p className="font-semibold">Invoice Date:</p>
                  {format(new Date(data.arrangement.created), 'dd/MM/yyyy')}
                </div>

                <div className="col-start-3">
                  <p className="font-semibold">Due Date:</p>{' '}
                  {format(
                    new Date(data.arrangement.dateOfFuneralService),
                    'dd/MM/yyyy'
                  )}
                </div>

                <div className="col-start-4" />
              </div>
            </section>

            <table className="w-full border-solid border-2 p-2">
              <thead className="border-solid border-2">
                <th className="border-solid border-2 p-1">Decription</th>
                <th className="border-solid border-2 p-1">Qty</th>
                <th className="border-solid border-2 p-1">Unit Price</th>
                <th className="border-solid border-2 p-1">Amount</th>
              </thead>
              <tbody className="text-right">
                <tr>
                  <td className="text-left border-solid border-2 p-1">
                    Storage
                  </td>
                  <td className="text-center border-solid border-2 p-1">
                    {calculate_days(
                      new Date(data.removalDate),
                      new Date(data.arrangement.dateOfFuneralService)
                    )}
                  </td>
                  <td className="border-solid border-2 p-1">
                    {formatter.format(350)}
                  </td>
                  <td className="border-solid border-2 p-1">
                    {formatter.format(data.arrangement.storage)}
                  </td>
                </tr>
                <tr>
                  <td className="text-left border-solid border-2 p-1">
                    Tombstone -{' '}
                    {data.arrangement.tombstone.type +
                      ' ' +
                      data.arrangement.tombstone.tombstoneName}
                  </td>
                  <td className="text-center border-solid border-2 p-1">1</td>
                  <td className="border-solid border-2 p-1">
                    {formatter.format(data.arrangement.tombstone.price)}
                  </td>
                  <td className="border-solid border-2 p-1">
                    {formatter.format(data.arrangement.tombstone.price)}
                  </td>
                </tr>
                <tr>
                  <td className="text-left border-solid border-2 p-1">
                    Coffin - {data.arrangement.coffin.coffinName}
                  </td>
                  <td className="text-center border-solid border-2 p-1">1</td>
                  <td className="border-solid border-2 p-1">
                    {formatter.format(data.arrangement.coffin.price)}
                  </td>
                  <td className="border-solid border-2 p-1">
                    {formatter.format(data.arrangement.coffin.price)}
                  </td>
                </tr>
                {data.arrangement.arrangementAddOnItems.map((item) =>
                  item.qty ? (
                    <tr key={item.name}>
                      <td className="text-left border-solid border-2 p-1">
                        {item.name}
                      </td>
                      <td className="text-center border-solid border-2 p-1">
                        {item.qty}
                      </td>
                      <td className="border-solid border-2 p-1">
                        {formatter.format(item.price)}
                      </td>
                      <td className="border-solid border-2 p-1">
                        {formatter.format(item.price * item.qty)}
                      </td>
                    </tr>
                  ) : (
                    <></>
                  )
                )}

                {data.arrangement?.additionalItems.map((item) => (
                  <tr key={item.description}>
                    <td className="text-left border-solid border-2 p-1">
                      {item.description}
                    </td>
                    <td className="text-center border-solid border-2 p-1">1</td>
                    <td className="border-solid border-2 p-1">
                      {formatter.format(item.amount)}
                    </td>
                    <td className="border-solid border-2 p-1">
                      {formatter.format(item.amount)}
                    </td>
                  </tr>
                ))}

                {data.arrangement.decor.banner.qty != 0 && (
                  <tr>
                    <td className="text-left border-solid border-2 p-1">
                      Banner
                    </td>
                    <td className="text-center border-solid border-2 p-1">
                      {data.arrangement.decor.banner.qty}
                    </td>
                    <td className="border-solid border-2 p-1">
                      {formatter.format(data.arrangement.decor.banner.price)}
                    </td>
                    <td className="border-solid border-2 p-1">
                      {formatter.format(
                        data.arrangement.decor.banner.price *
                          data.arrangement.decor.banner.qty
                      )}
                    </td>
                  </tr>
                )}
                {data.arrangement.decor.candle.qty != 0 && (
                  <tr>
                    <td className="text-left border-solid border-2 p-1">
                      Banner
                    </td>
                    <td className="text-center border-solid border-2 p-1">
                      {data.arrangement.decor.candle.qty}
                    </td>
                    <td className="border-solid border-2 p-1">
                      {formatter.format(data.arrangement.decor.candle.price)}
                    </td>
                    <td className="border-solid border-2 p-1">
                      {formatter.format(
                        data.arrangement.decor.candle.price *
                          data.arrangement.decor.candle.qty
                      )}
                    </td>
                  </tr>
                )}

                {data.arrangement.decor.glass.qty != 0 && (
                  <tr>
                    <td className="text-left border-solid border-2 p-1">
                      Banner
                    </td>
                    <td className="text-center border-solid border-2 p-1">
                      {data.arrangement.decor.glass.qty}
                    </td>
                    <td className="border-solid border-2 p-1">
                      {formatter.format(data.arrangement.decor.glass.price)}
                    </td>
                    <td className="border-solid border-2 p-1">
                      {formatter.format(
                        data.arrangement.decor.glass.price *
                          data.arrangement.decor.glass.qty
                      )}
                    </td>
                  </tr>
                )}
                {data.arrangement.decor.photo.qty != 0 && (
                  <tr>
                    <td className="text-left border-solid border-2 p-1">
                      Banner
                    </td>
                    <td className="text-center border-solid border-2 p-1">
                      {data.arrangement.decor.photo.qty}
                    </td>
                    <td className="border-solid border-2 p-1">
                      {formatter.format(data.arrangement.decor.photo.price)}
                    </td>
                    <td className="border-solid border-2 p-1">
                      {formatter.format(
                        data.arrangement.decor.photo.price *
                          data.arrangement.decor.photo.qty
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <section className="w-full mt-5">
              <div className="grid grid-cols-4">
                <div className="col-start-3 col-span-2">
                  <table className="w-full">
                    <tbody className="border-2">
                      <tr>
                        <td className="border-2 p-1">Discount</td>
                        <td className="text-right border-2 p-1">
                          {formatter.format(data.arrangement.discount)}
                        </td>
                      </tr>
                      <tr>
                        <td className="border-2 p-1">Amount Due</td>
                        <td className="text-right border-2 p-1">
                          {formatter.format(data.arrangement.totalDue)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </section>

          <div className="flex w-full justify-end gap-x-2 mt-5">
            <Button disabled={loading} variant={'outline'} onClick={onClose}>
              Close
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
};
