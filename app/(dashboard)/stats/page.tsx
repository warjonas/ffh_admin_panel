import Image from 'next/image';
import React from 'react';

import underContruction from '@/assets/220880-P1KV8M-746.jpg';

type Props = {};

const Statistics = (props: Props) => {
  return (
    <section className="p-5 w-full h-full flex items-center justify-center">
      <Image
        src={underContruction}
        width={1920}
        height={1080}
        alt="under construction"
        className="w-1/2 h-1/2"
      />
    </section>
  );
};

export default Statistics;
