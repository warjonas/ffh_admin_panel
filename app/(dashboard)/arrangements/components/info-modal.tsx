'use client';

import { useEffect, useRef, useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { PenBoxIcon, PrinterIcon } from 'lucide-react';
import useSWR, { SWRConfiguration } from 'swr';
import { Arrangement } from '@/types';
import { format } from 'date-fns';
import generatePDF, { Margin, Resolution, usePDF } from 'react-to-pdf';

import { useReactToPrint } from 'react-to-print';

import { formatter } from '@/lib/utils';
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
  }: { data: Arrangement; error: any; isLoading: any } = useSWR(
    `/api/arrangement/${id}`,
    fetcher,
    config
  );

  const getPageMargins = () => {
    return `@page { margin: 3rem 2rem 3rem 2rem !important; }`;
  };

  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Funeral Arrangement Sheet - ${data?.deceased?.firstNames} ${data?.deceased?.lastName}`,
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
      title={`Viewing Funeral Arrangement for: ${data?.deceased?.firstNames} ${data?.deceased?.lastName}`}
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
            <section className="w-full h-fit">
              <div className="mb-2 p-2">
                <h1 className="text-xl   text-center  uppercase">
                  Fortuin Funeral Home (PTY) LTD
                </h1>
                <h2 className="font-semibold text-lg text-center">
                  Funeral Arrangement Sheet
                </h2>
              </div>
              <h1 className="text-center text-xl mb-5">
                Invoice No.:{' '}
                <span className="font-semibold"> {data?.invoiceNo}</span>
              </h1>
              <h2 className="my-2"> Created by: {data?.createdBy}</h2>

              <div className="w-full flex flex-col gap-y-1">
                <h2 className="bg-blue-200 p-1 mb-1 text-center font font-semibold border-b uppercase border-black">
                  Details of the Deceased
                </h2>
                <p className="font-semibold">
                  Fortuin Funeral Home Member No.:{' '}
                  <span className="font-normal">
                    {data?.deceased?.ffhMemberNo}
                  </span>
                </p>
                <p className="font-semibold">
                  ID Number:{' '}
                  <span className="font-normal">
                    {data?.deceased?.idNumber}
                  </span>
                </p>
                <p className="font-semibold">
                  Sunrise:{' '}
                  <span className="font-normal">
                    {data.deceased &&
                      format(
                        new Date(data?.deceased?.dateOfBirth),
                        'MM/dd/yyyy'
                      )}
                  </span>
                </p>
                <p className="font-semibold">
                  Sunset:{' '}
                  <span className="font-normal">
                    {data.deceased &&
                      format(
                        new Date(data?.deceased?.dateOfDeath),
                        'MM/dd/yyyy'
                      )}
                  </span>
                </p>
                <div className="flex flex-row gap-x-2">
                  <p className="font-semibold">
                    First Name(s):{' '}
                    <span className="font-normal">
                      {' '}
                      {data?.deceased?.firstNames}
                    </span>
                  </p>
                  <p className="font-semibold">
                    Last Name:{' '}
                    <span className="font-normal">
                      {' '}
                      {data?.deceased?.lastName}
                    </span>{' '}
                  </p>
                </div>
                <p className="font-semibold">
                  Removal Date:{' '}
                  <span className="font-normal">
                    {data.deceased &&
                      format(
                        new Date(data?.deceased?.removalDate),
                        'MM/dd/yyyy'
                      )}
                  </span>
                </p>
                <p className="font-semibold">
                  Removal From:{' '}
                  <span className="font-normal">
                    {data.deceased?.removalFrom?.street},{' '}
                    {data.deceased?.removalFrom?.city},{' '}
                  </span>
                </p>
                <p className="font-semibold">
                  Removal Time: <span className="font-normal">11am</span>{' '}
                </p>
              </div>

              <div className="my-5">
                <h2 className="bg-blue-200 p-1 mb-1 text-center font font-semibold border-b uppercase border-black">
                  Details of Family Representatives
                </h2>
                <div className="grid grid-cols-4">
                  <p className="col-start-1">First Name</p>
                  <p className="col-start-2">Last Name</p>
                  <p className="col-start-3">Relationship</p>
                  <p className="col-start-4">Phone No.</p>
                  <hr className="w-full my-1 col-span-4" />
                  {data?.familyReps.map((rep) => (
                    <div
                      key={rep.phoneNo}
                      className="grid grid-cols-4 col-span-4"
                    >
                      <p className="col-start-1">{rep.firstName}</p>
                      <p className="col-start-2">{rep.lastName}</p>
                      <p className="col-start-3">{rep.relationship}</p>
                      <p className="col-start-4">{rep.phoneNo}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col">
                <h2 className="bg-blue-200 p-1 mb-1 text-center font font-semibold border-b uppercase border-black">
                  Funeral Arrangements
                </h2>
                <div className="flex flex-row w-full">
                  <div className="w-1/2 border-r border-gray-300">
                    <h2 className="uppercase font-semibold">Home</h2>
                    <p className="font-medium">
                      Delivery Address: {data?.deliveryAddress} <br />
                      Delivery Time: {data?.DeliveryTime}
                    </p>
                    <h2 className="uppercase font-semibold mt-2">CHURCH</h2>
                    <p className="font-medium">
                      Name of Church: {data?.church.churchName} <br />
                      Church Address: {data?.church.Address.street},{' '}
                      {data?.church?.Address.city},{' '}
                    </p>
                    <h2 className="uppercase font-semibold mt-2">Cemetry</h2>
                    <p className="font-medium">
                      Cemetry Name: {data.grave.graveName} <br />
                      Cemetry Time: {data.graveTime}
                    </p>
                    <h2 className="uppercase font-semibold mt-2">
                      Minister Information
                    </h2>
                    <p className="font-medium">
                      Minister Name: {data.minister.firstName}{' '}
                      {data.minister.lastName} <br />
                      Phone No.: {data.minister.phoneNo}
                    </p>
                    <h2 className="uppercase font-semibold mt-2">Notes</h2>
                    <p>{data.notes ? data.notes : 'No additional notes.'}</p>
                  </div>

                  <div className="ml-2 w-1/2">
                    <p className="font-medium">
                      <span className="font-semibold"> Coffin name: </span>
                      {data.coffin.coffinName}
                    </p>
                    <p className="font-medium">
                      <span className="font-semibold"> Digger: </span>
                      {data.digger ? formatter.format(data.digger) : 'N/A'}
                    </p>

                    <p className="font-medium">
                      <span className="font-semibold"> Cross size: </span>
                      {data.crossSize}
                    </p>
                    <p className="font-medium">
                      <span className="font-semibold"> Wreaths: </span>
                      {data.wreaths ? formatter.format(data.wreaths) : 'N/A'}
                    </p>
                    <p className="font-medium">
                      <span className="font-semibold"> Doves: </span>
                      {data.doves ? formatter.format(data.doves) : 'N/A'}
                    </p>

                    <p className="font-medium">
                      <span className="font-semibold"> Live Streaming: </span>
                      {data.liveStreaming
                        ? formatter.format(data.liveStreaming)
                        : 'N/A'}
                    </p>
                    <p className="font-medium">
                      <span className="font-semibold">
                        {' '}
                        Amount of Programs:{' '}
                      </span>
                      {data.programs}
                    </p>

                    <p className="font-medium">
                      <span className="font-semibold"> Family Car: </span>
                      {data.familyCar
                        ? formatter.format(data.familyCar)
                        : 'N/A'}
                    </p>
                    <p className="font-medium">
                      <span className="font-semibold"> Bus from Home: </span>
                      {data.bus ? formatter.format(data.bus) : 'N/A'}
                    </p>
                    <p className="font-medium">
                      <span className="font-semibold"> Tombstone: </span>
                      {data.tombstone.type}
                    </p>
                    <p className="font-medium">
                      <span className="font-semibold">
                        {' '}
                        Name of Granite Tombstone:{' '}
                      </span>
                      {data.tombstone.tombstoneName !== ''
                        ? data.tombstone.tombstoneName
                        : 'Not Applicable.'}
                    </p>

                    <p className="font-medium">
                      <span className="font-semibold"> Storage: </span>
                      {formatter.format(data?.storage)}
                    </p>

                    <h2 className="uppercase font-semibold mt-2">Decor</h2>
                    <hr className="w-2/3" />
                    <div className="flex flex-row gap-x-10">
                      <div>
                        <p className="font-medium">
                          <span className="font-semibold"> Candle: </span>
                          <p>Qty:&nbsp; {data.decor.candle.qty}</p>
                          <p>Price:&nbsp; {data.decor.candle.price}</p>
                        </p>
                        <p className="font-medium">
                          <span className="font-semibold"> Photo: </span>
                          <p>Qty:&nbsp; {data.decor.photo.qty}</p>
                          <p>Price:&nbsp; {data.decor.photo.price}</p>
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">
                          <span className="font-semibold"> Banner: </span>
                          <p>Qty:&nbsp; {data.decor.banner.qty}</p>
                          <p>Price:&nbsp; {data.decor.banner.price}</p>
                        </p>
                        <p className="font-medium">
                          <span className="font-semibold"> Glass: </span>
                          <p>Qty:&nbsp; {data.decor.glass.qty}</p>
                          <p>Price:&nbsp; {data.decor.glass.price}</p>
                        </p>
                      </div>
                    </div>
                    <hr className="w-2/3 mb-2" />
                  </div>
                </div>
              </div>
              <h1 className="text-xl font-semibold mt-10 pr-5 text-right">
                Total Payable: {formatter.format(data?.totalDue)}
              </h1>
              <h1 className="text-xl font-semibold text-right pr-5">
                Outstanding Balance:{' '}
                {formatter.format(data?.outstandingBalance)}
              </h1>
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
