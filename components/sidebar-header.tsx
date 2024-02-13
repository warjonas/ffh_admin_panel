'use client';

import Image from 'next/image';
import React from 'react';

type Props = {};

const SidebarHeader = (props: Props) => {
  return (
    <>
      <Image
        src="https://i.ibb.co/G9z3n0M/Logo-color-alt.png"
        height={1080}
        width={1920}
        alt="logo"
        className="h-20 w-48"
      />
    </>
  );
};

export default SidebarHeader;
