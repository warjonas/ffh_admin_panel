import Image from 'next/image';
import React from 'react';

import underContruction from '@/assets/220880-P1KV8M-746.jpg';
import Sidebar from './components/sidebar';
import Heading from '@/components/ui/heading';

type Props = {};

const Pricing = (props: Props) => {
  return (
    <section className="p-5 w-full h-full flex flex-col">
      <Heading
        title="Statistics"
        subtitle="Detailed information of the business "
      />
      <Sidebar />
    </section>
  );
};

export default Pricing;
