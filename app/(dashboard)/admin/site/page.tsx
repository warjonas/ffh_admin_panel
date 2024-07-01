import Image from 'next/image';
import React from 'react';

import underContruction from '@/assets/220880-P1KV8M-746.jpg';
import Heading from '@/components/ui/heading';
import ImageUpload from '@/components/ui/image-upload';

type Props = {};

const Site = (props: Props) => {
  return (
    <section className="p-5 w-full h-full flex flex-col">
      <Heading
        title="Manage Website Content"
        subtitle="Manage content for Fortuin Funeral Home Website"
      />

      <section className="w-full flex flex-col">
        <section className="flex flex-col w-full gap-y-4 mb-10">
          <h1 className="text-lg font-medium">
            Upload new Images to Display in gallery
          </h1>
          {/* <ImageUpload preset="geq05da0" /> */}
        </section>

        <hr className="w-full border-t mb-4" />

        <p>
          This section is a work in progress. More features to be added soon.
        </p>
      </section>
    </section>
  );
};

export default Site;
