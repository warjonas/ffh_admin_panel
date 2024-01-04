'use client';

import { Modal } from '@/components/ui/modal';
import { Removal, RemovalReceipt } from '@prisma/client';
import React, { useState } from 'react';
import useSWR, { SWRConfiguration } from 'swr';

interface RemReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  id: string;
  receipts: RemovalReceipt[]
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const RemovalReceiptModal: React.FC<RemReceiptModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  id,
  receipts,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [outstandingBalance, setOutstandingBalance] = useState(0)

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

  if (isLoading)
    return (
      <Modal title={`Loading`} description="" isOpen={isOpen} onClose={onClose}>
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Calculating outstanding Balance...
          </span>
        </div>
      </Modal>
    );

    if(receipts){
      const totalPayments = receipts.reduce((total,removalReceipt ) =>{
        return total + removalReceipt.receivedAmount
      }, 0)

      setOutstandingBalance(totalPayments)
    }

  if (error)
    return (
      <Modal
        title={`Error Occurred`}
        description=""
        isOpen={isOpen}
        onClose={onClose}
      >
        An error occurred. Contact your technical administrator.
      </Modal>
    );


    


  return <Modal title='Create new receipt' description='A new receipt for payment made' isOpen={isOpen} onClose={onClose}>
    <>
    <h1>Outstanding Balance is: {outstandingBalance}</h1>

    </>
  </Modal>;
};

export default RemovalReceiptModal;
