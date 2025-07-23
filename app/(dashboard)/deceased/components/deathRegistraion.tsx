'use client';

import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Deceased } from '@/types';
import { PrinterIcon } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import useSWR, { SWRConfiguration } from 'swr';
import Logo from '@/assets/Logo.png';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRegisterDeathModal } from '@/hooks/use-deceased-modal';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

const getSex = (idNumber: string) => {
  const sexIdentifier = idNumber.substring(6, 10);

  let sex;

  if (Number(sexIdentifier) < 5000) {
    sex = 'Female';
  } else {
    sex = 'Male';
  }

  return sex;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const DeathRegistration = () => {
  const [isMounted, setIsMounted] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const pathname = usePathname();
  const id = searchParams.get('deceasedId');
  const registrationModal = useRegisterDeathModal();
  const today = new Date();

  const config: SWRConfiguration = {
    revalidateOnMount: true,
  };

  const getPageMargins = () => {
    return `@page { margin: 3rem 4rem 3rem 4rem !important; }`;
  };

  const componentRef = useRef(null);

  const {
    data,
    error,
    isLoading,
  }: { data: Deceased; error: any; isLoading: any } = useSWR(
    id ? `/api/deceased/${id}` : null,
    fetcher,
    config
  );

  const onClose = () => {
    router.back();
    registrationModal.onClose();
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Registration of Death - ${data?.firstNames} ${data?.lastName}`,
  });

  useEffect(() => {
    setIsMounted(true);
    console.log('DeathRegistration', isMounted);
  }, []);

  if (isMounted == false) {
    return null;
  }

  if (error) {
    return (
      <Modal
        title={`Error Occurred`}
        description=""
        isOpen={registrationModal.isOpen}
        onClose={onClose}
      >
        An error occurred while fetching the data.
      </Modal>
    );
  }

  if (isLoading)
    return (
      <Modal
        title={`Loading`}
        description=""
        isOpen={registrationModal.isOpen}
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
      title="Registration of Death"
      description="Please complete details for death registraion"
      isOpen={registrationModal.isOpen}
      onClose={onClose}
    >
      {data && isMounted == true && (
        <>
          <Button onClick={handlePrint}>
            {' '}
            <PrinterIcon className="h-4 w-4 mr-2" /> Print/Save
          </Button>

          <section
            className="pt-2 px-5 space-x-2 flex items-center justify-end w-full flex-col h-fit"
            id="print-ref"
            ref={componentRef}
          >
            <style> {getPageMargins()}</style>

            <section className="w-full h-fit">
              {/**First Page */}
              <div className="grid grid-cols-2">
                <div className="col-span-2 flex flex-col items-center justify-center">
                  <Image
                    src={Logo}
                    height={1080}
                    width={1920}
                    className="w-2/3 h-48"
                    alt="Logo"
                  />
                  <hr className=" mt-2 mb-5 w-full border border-t-2 border-black" />
                </div>

                <div className="grid grid-cols-2 col-span-2 justify-end">
                  <div className="flex flex-row col-start-2 text-right items-baseline">
                    <h2 className="mr-2">Date: </h2>
                    <p className="font-bold">{format(today, 'dd MMMM yyyy')}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 col-span-2 justify-end mt-5">
                  <div className="flex flex-col col-start-1 text-left items-baseline font-medium">
                    <b>
                      <h2 className="mr-2">
                        To:{' '}
                        <input className="w-64 p-1 border-b border-b-black" />
                      </h2>
                    </b>
                    <b>
                      <h2 className="mr-2">Re: Registration of Death </h2>
                    </b>

                    <h2 className="mr-2 mt-5">Dear Sir/Madam </h2>
                  </div>
                </div>

                <div className="col-span-2 justify-end mt-8">
                  <p className="w-full">
                    I the undersigned{' '}
                    <input className="w-48 font-bold p-1 border-b border-b-black" />
                    , ID number{' '}
                    <input className="w-36 font-bold p-1 border-b border-b-black" />{' '}
                    hereby authorize a representative of Fortuin Funeral Home
                    (who now present this letter to you) to register the death
                    of <b>{data.firstNames + ' ' + data.lastName} </b> who died
                    on <b>{format(new Date(data.dateOfDeath), 'dd/MM/yyyy')}</b>
                  </p>
                </div>

                <div className="col-start-1 flex flex-col justify-start my-8">
                  <p>_______________________</p>
                  <h2 className="font-semibold">Signature</h2>
                </div>
              </div>
              <div className="pagebreak"> </div>

              {/**Second Page */}

              <div className="col-span-2 flex flex-col w-full h-full">
                <h1 className="p-2 border-2 border-black font-medium text-center w-full uppercase mb-2">
                  Cemetry Information
                </h1>

                {/* deceased */}
                <div className="grid grid-cols-2">
                  <h2 className=" font-bold ">Deceased</h2>
                  <hr className=" col-span-2 w-28 border-t-2 border-black mb-2" />

                  <p className="col-start-1 uppercase font-bold">
                    Full names and Surname
                  </p>
                  <p className="col-start-2">
                    {data.firstNames + ' ' + data.lastName}
                  </p>

                  <p className="col-start-1 uppercase font-bold">Address</p>
                  <p className="col-start-2">
                    {data.removalFrom.street + ', ' + data.removalFrom.city}
                  </p>

                  <p className="col-start-1 uppercase font-bold">ID Number</p>
                  <p className="col-start-2">{data.idNumber}</p>

                  <p className="col-start-1 uppercase font-bold">
                    Date of Birth
                  </p>
                  <p className="col-start-2">
                    {format(new Date(data.dateOfBirth), 'dd/MM/yyyy')}
                  </p>

                  <p className="col-start-1 uppercase font-bold">
                    Date of Burial
                  </p>
                  <p className="col-start-2">
                    {data.arrangement ? (
                      format(
                        new Date(data?.arrangement.dateOfFuneralService),
                        'dd/MM/yyyy'
                      )
                    ) : (
                      <p className="col-start-2">
                        ____________________________________
                      </p>
                    )}
                  </p>

                  <p className="col-start-1 uppercase font-bold">
                    Burial Order number
                  </p>
                  <p className="col-start-2">
                    {' '}
                    <input className="w-[75%] font-bold p-1 border-b border-b-black" />
                  </p>

                  <p className="col-start-1 uppercase font-bold">
                    Cemetry Name
                  </p>
                  <p className="col-start-2">
                    {data.arrangement ? (
                      data?.arrangement?.grave.graveName
                    ) : (
                      <p className="col-start-2">
                        <input className="w-[75%] font-bold p-1 border-b border-b-black" />
                      </p>
                    )}
                  </p>

                  <p className="col-start-1 uppercase font-bold">SEX</p>
                  <p className="col-start-2">{getSex(data.idNumber)}</p>

                  <p className="col-start-1 uppercase font-bold">
                    Cause of Death
                  </p>
                  <p className="col-start-2">
                    <input className="w-[75%] font-bold p-1 border-b border-b-black" />
                  </p>
                </div>

                <div className="grid grid-cols-2 mt-4">
                  <h2 className=" font-bold ">Applicant</h2>
                  <hr className=" col-span-2 w-28 border-t-2 border-black mb-2" />

                  <p className="col-start-1 uppercase font-bold">
                    Full names and Surname
                  </p>
                  <p className="col-start-2">
                    <input className="w-[75%] font-bold p-1 border-b border-b-black" />
                  </p>

                  <p className="col-start-1 uppercase font-bold">Address</p>
                  <p className="col-start-2">
                    <input className="w-[75%] font-bold p-1 border-b border-b-black" />
                  </p>

                  <p className="col-start-1 uppercase font-bold">ID Number</p>
                  <p className="col-start-2">
                    <input className="w-[75%] font-bold p-1 border-b border-b-black" />
                  </p>

                  <p className="col-start-1 uppercase font-bold">
                    Cellphone Number
                  </p>
                  <p className="col-start-2">
                    <input className="w-[75%] font-bold p-1 border-b border-b-black" />
                  </p>

                  <p className="col-start-1 uppercase font-bold">Signature</p>
                  <p className="col-start-2">
                    ____________________________________
                  </p>
                </div>

                <div className="grid grid-cols-2 mt-4">
                  <h2 className=" font-bold ">
                    Plot Owner (if different from applicant)
                  </h2>
                  <hr className=" col-span-2 w-28 border-t-2 border-black mb-2" />

                  <p className="col-start-1 uppercase font-bold">
                    Full names and Surname
                  </p>
                  <p className="col-start-2">
                    <input className="w-[75%] font-bold p-1 border-b border-b-black" />
                  </p>

                  <p className="col-start-1 uppercase font-bold">Address</p>
                  <p className="col-start-2">
                    <input className="w-[75%] font-bold p-1 border-b border-b-black" />
                  </p>

                  <p className="col-start-1 uppercase font-bold">ID Number</p>
                  <p className="col-start-2">
                    <input className="w-[75%] font-bold p-1 border-b border-b-black" />
                  </p>

                  <p className="col-start-1 uppercase font-bold">
                    Cellphone Number
                  </p>
                  <p className="col-start-2">
                    <input className="w-[75%] font-bold p-1 border-b border-b-black" />
                  </p>

                  <p className="col-start-1 uppercase font-bold">Signature</p>
                  <p className="col-start-2">
                    ____________________________________
                  </p>
                </div>

                <div className="grid grid-cols-2 mt-4">
                  <h2 className=" font-bold ">Undertaker Information</h2>
                  <hr className=" col-span-2 w-28 border-t-2 border-black mb-2" />

                  <p className="col-start-1 uppercase font-bold">
                    Undertaker Name
                  </p>
                  <p className="col-start-2">Fortuin Funeral Home</p>

                  <p className="col-start-1 uppercase font-bold">
                    Telephone Number
                  </p>
                  <p className="col-start-2">072 481 1414</p>

                  <p className="col-start-1 uppercase font-bold">Address</p>
                  <p className="col-start-2">
                    88 Laurence Erasmus Drive <br /> Bloemendal <br /> Port
                    Elizabeth
                  </p>
                </div>

                <div className="grid grid-cols-4 border-2 border-black mt-5 ">
                  <div className="font-semibold col-start-1 col-span-2 border-r-2 border-black text-center">
                    <h1>Fortuin Funeral Home</h1>
                    <p>
                      88 Laurence Erasmus Drive <br /> Bloemendal <br /> Port
                      Elizabeth <br /> 6061 <br /> TEL: 072 481 1414 <br />{' '}
                      EMAIL: admin@fortuinfuneralhome.co.za
                    </p>
                  </div>

                  <div className="col-start-3 col-span-2 items-center justify-center flex">
                    <h2 className="font-bold text-xl text-gray-400">
                      Signature
                    </h2>
                  </div>
                </div>
              </div>
            </section>
          </section>
        </>
      )}
    </Modal>
  );
};

export default DeathRegistration;
