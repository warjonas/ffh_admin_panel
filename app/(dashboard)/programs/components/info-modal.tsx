'use client';

import { useEffect, useRef, useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { PenBoxIcon, PrinterIcon } from 'lucide-react';
import { FuneralProgramColumn } from './columns';
import useSWR, { SWRConfiguration } from 'swr';
import { Arrangement } from '@/types';
import { format } from 'date-fns';
import generatePDF, { Margin, Resolution, usePDF } from 'react-to-pdf';

import { formatter } from '@/lib/utils';
import { Deceased, FuneralProgram } from '@prisma/client';
import { useReactToPrint } from 'react-to-print';
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
  }: {
    data: FuneralProgram & { deceased: Deceased };
    error: any;
    isLoading: any;
  } = useSWR(`/api/program/${id}`, fetcher, config);

  const getPageMargins = () => {
    return `@page { margin: 1rem 2rem 1rem 2rem !important; }`;
  };

  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Funeral Program Preview for the late
     ${data?.deceased?.firstNames} ${data?.deceased?.lastName} `,
  });

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
      title={`Viewing Funeral Program for: ${data?.deceased?.firstNames} ${data?.deceased?.firstNames}`}
      description="A preview of the funeral program"
      isOpen={isOpen}
      onClose={onClose}
    >
      {isLoading && <p>Loading</p>}
      {data && (
        <>
          <Button onClick={handlePrint}>
            {' '}
            <PrinterIcon className="h-4 w-4 mr-2" /> Print
          </Button>

          <section
            className="pt-2 space-x-2 flex items-center justify-end w-full flex-col h-fit"
            id="print-ref"
            ref={componentRef}
          >
            <style>{getPageMargins()}</style>

            <section className="w-full h-fit">
              <div className="mb-2 p-2">
                <h1 className="text-xl   text-center  uppercase">
                  Fortuin Funeral Home (PTY) LTD
                </h1>
                <h2 className="font-semibold text-lg text-center bg-blue-200">
                  Funeral Program Preview
                </h2>
              </div>
              <hr className="w-full my-2 border-secondary-foreground " />

              <div className="flex flex-col gap-y-2">
                <p className="font-semibold">
                  Language of Program:{' '}
                  <span className="font-normal">
                    {' '}
                    {data?.languageOfProgram}
                  </span>
                </p>
                <p className="font-semibold">
                  Name/s of Deceased:{' '}
                  <span className="font-normal">
                    {' '}
                    {data?.deceased.firstNames}
                  </span>
                </p>
                <p className="font-semibold">
                  Nickname:{' '}
                  <span className="font-normal">
                    {' '}
                    {data?.deceased.nickName}
                  </span>
                </p>
                <p className="font-semibold">
                  Surname of Deceased:{' '}
                  <span className="font-normal">
                    {' '}
                    {data?.deceased.lastName}
                  </span>
                </p>
                <p className="font-semibold">
                  Date of Birth:{' '}
                  <span className="font-normal">
                    {' '}
                    {format(new Date(data?.deceased.dateOfBirth), 'dd/MM/yyyy')}
                  </span>
                </p>
                <p className="font-semibold">
                  Date of Death:{' '}
                  <span className="font-normal">
                    {' '}
                    {format(new Date(data?.deceased.dateOfDeath), 'dd/MM/yyyy')}
                  </span>
                </p>
                <p className="font-semibold">
                  The deceased is survived by: <br />{' '}
                  <span className="font-normal"> {data?.survivedBy}</span>
                </p>
              </div>
              <hr className="w-full my-5 border-secondary-foreground " />
              <div className="flex flex-col">
                <h1 className="font-semibold text-center text-lg underline bg-blue-200">
                  Service at Home
                </h1>
                <p className="font-semibold">
                  Officiating Minister:{' '}
                  <span className="font-normal">
                    {' '}
                    {data?.atHome?.officiatingMinister}
                  </span>
                </p>
                <p className="font-semibold">
                  Start Time:{' '}
                  <span className="font-normal">
                    {' '}
                    {data?.atHome?.startTime
                      ? data?.atHome?.startTime
                      : 'Not Provided.'}
                  </span>
                </p>
              </div>
              <hr className="w-full my-5 border-secondary-foreground " />
              <div className="flex flex-col gap-y-2">
                <h1 className="font-semibold text-center text-lg underline bg-blue-200">
                  Service at Church
                </h1>
                <p className="font-semibold">
                  Officiating Minister:{' '}
                  <span className="font-normal">
                    {' '}
                    {data?.atChurch?.officiatingMinister}
                  </span>
                </p>
                <p className="font-semibold">
                  Orbituary:{' '}
                  <span className="font-normal">
                    {' '}
                    {data?.atChurch?.orbituary}
                  </span>
                </p>
                <p className="font-semibold">
                  Vote of Thanks:{' '}
                  <span className="font-normal">
                    {' '}
                    {data?.atChurch?.voteOfThanks}
                  </span>
                </p>
                <p className="font-semibold">
                  Other Speakers/Items: <br />
                  <span className="font-normal">
                    {' '}
                    {data?.atChurch?.otherItems}
                  </span>
                </p>
                <p className="font-semibold">
                  Start Time:{' '}
                  <span className="font-normal">
                    {' '}
                    {data?.atChurch?.startTime
                      ? data?.atChurch?.startTime
                      : 'Not Provided'}
                  </span>
                </p>
                <p className="font-semibold">
                  End Time:{' '}
                  <span className="font-normal">
                    {' '}
                    {data?.atChurch?.endTime
                      ? data?.atChurch?.endTime
                      : 'Not Provided'}
                  </span>
                </p>
              </div>
              <hr className="w-full my-5 border-secondary-foreground " />
              <div>
                <h1 className="font-semibold text-center text-lg underline bg-blue-200">
                  Hymns
                </h1>
                <p className="font-semibold">
                  Name of Hymn Book:
                  <span className="font-normal">
                    {' '}
                    {data?.hymn?.nameOfHymnBook}
                  </span>
                </p>
                <div className="grid grid-cols-3 w-full">
                  <p className="col-start-2 font-semibold underline">
                    Hymn Number
                  </p>
                  <p className="col-start-3 font-semibold underline">
                    3 Brief details of Hymn
                  </p>
                  {data?.hymn?.hymns.map((hymn, i) => (
                    <>
                      <p className=""> {i + 1}</p>
                      <p className="col-start-2">{hymn?.hymnNumber}</p>
                      <p className="col-start-3">{hymn?.detailsOfHymn}</p>
                    </>
                  ))}
                </div>
              </div>
              <hr className="w-full my-5 border-secondary-foreground" />
              <div className="flex flex-col">
                <h1 className="font-semibold text-center text-lg underline bg-blue-200">
                  Any other information
                </h1>
                <p>{data?.otherInformation}</p>
              </div>
              <hr className="w-full my-5 border-secondary-foreground" />

              <div className="flex flex-col">
                <h1 className="font-semibold text-center text-lg underline mb-2 bg-blue-200">
                  Pallbearers
                </h1>
                <div className=" flex flex-row w-full">
                  <div className="w-1/2">
                    <h2 className="text-center font-semibold underline">
                      Into House
                    </h2>
                    {data?.pallbearersInHouse.map((house, index) => (
                      <p key={index + house.lastName}>
                        {house.firstName} {house.lastName}
                      </p>
                    ))}
                  </div>
                  <div className="w-1/2 border-l-2 pl-2 border-secondary-foreground">
                    <h2 className="text-center font-semibold underline">
                      Out of House
                    </h2>
                    {data?.pallbearersOutHouse.map((house, index) => (
                      <p key={index + house.lastName}>
                        {house.firstName} {house.lastName}
                      </p>
                    ))}
                  </div>
                </div>
                <hr className="w-1/2 self-center my-5 border-secondary-foreground" />

                <div className=" flex flex-row w-full">
                  <div className="w-1/2">
                    <h2 className="text-center font-semibold underline">
                      Into Church
                    </h2>
                    {data?.pallbearersInChurch.map((church, index) => (
                      <p key={index + church.lastName}>
                        {church.firstName} {church.lastName}
                      </p>
                    ))}
                  </div>
                  <div className="w-1/2 border-l-2 pl-2 border-secondary-foreground">
                    <h2 className="text-center font-semibold underline">
                      Out of Church
                    </h2>
                    {data?.pallbearersOutChurch.map((church, index) => (
                      <p key={index + church.lastName}>
                        {church.firstName} {church.lastName}
                      </p>
                    ))}
                  </div>
                </div>

                <hr className="w-1/2 self-center my-5 border-secondary-foreground" />
                <div className="w-1/2 ">
                  <h2 className="text-center font-semibold underline">
                    To the Grave
                  </h2>
                  {data?.pallbearersGrave.map((grave, index) => (
                    <p key={index + grave.lastName}>
                      {grave.firstName} {grave.lastName}
                    </p>
                  ))}
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
        </>
      )}
    </Modal>
  );
};
