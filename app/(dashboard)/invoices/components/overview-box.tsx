'use client';

import { cn, formatter } from '@/lib/utils';
import React from 'react';

interface OverviewBoxProps {
  title: string;
  amount: number;
  subtitleLinkText: string;
  classes: string;
}

const OverviewBox = (props: OverviewBoxProps) => {
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
      <p className="underline hover:cursor-pointer mt-2 text-right">
        {props.subtitleLinkText}
      </p>
    </div>
  );
};

export default OverviewBox;
