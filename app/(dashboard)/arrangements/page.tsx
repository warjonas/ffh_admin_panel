import Heading from '@/components/ui/heading';
import React from 'react';
import HeaderOptions from './components/header-options';

type Props = {};

const Arrangements = (props: Props) => {
  return (
    <section className="p-5 w-full h-full">
      <Heading
        title="Arrangements"
        subtitle="Create and manage funeral arrangements"
      />
      <section>
        <div className="flex justify-between">
          <HeaderOptions />
        </div>
      </section>
    </section>
  );
};

export default Arrangements;
