'use client';

import { useViewPaymentsModal } from '@/hooks/use-deceased-modal';
import { cn, formatter } from '@/lib/utils';
import React, { useState } from 'react';

type modals = 'outstanding' | 'payment';

interface OverviewBoxProps {
  title: string;
  amount: number;
  subtitleLinkText: string;
  classes: string;
  modal: modals;
}

const OverviewBox = (props: OverviewBoxProps) => {
  const paymentsModal = useViewPaymentsModal();

  const [modal, setModal] = useState(false);

  const onPress = () => {
    switch (props.modal) {
      case 'payment':
        paymentsModal.onOpen();
        break;

      case 'outstanding':
        setModal(!modal);
        break;

      default:
        break;
    }
  };

  return (
    <div className="flex flex-col">
      <div
        className={cn(
          'rounded-md w-full   text-background p-3 shadow-md ',
          props.classes
        )}
      >
        <h2 className="text-xl font-medium">{props.title}</h2>
        <hr className="w-full my-2" />
        <p className="text-xl">{formatter.format(props.amount)}</p>
      </div>
      <p
        className="underline hover:cursor-pointer mt-2 text-right"
        onClick={onPress}
      >
        {props.subtitleLinkText}
      </p>
    </div>
  );
};

export default OverviewBox;
