'use client';

import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

type Props = {};

const HeaderOptions = (props: Props) => {
  const router = useRouter();

  return (
    <section className="flex justify-end w-full ">
      <Button
        className="w-fit p-5 text-xl flex justify-center gap-x-2 text-center"
        onClick={() => router.push('/arrangements/new')}
      >
        <span>
          <PlusCircle className="h-5 w-5" />
        </span>{' '}
        New Arrangement
      </Button>
    </section>
  );
};

export default HeaderOptions;
