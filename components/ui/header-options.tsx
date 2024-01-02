'use client';

import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

type Props = {
  title: string;
  path: string;
};

const HeaderOptions = ({ title, path }: Props) => {
  const router = useRouter();

  return (
    <section className="flex justify-end w-full ">
      <Button
        className="w-fit p-5 text-xl flex justify-center gap-x-2 text-center"
        onClick={() => router.push(path)}
      >
        <span>
          <PlusCircle className="h-5 w-5" />
        </span>{' '}
        {title}
      </Button>
    </section>
  );
};

export default HeaderOptions;
