'use client';

import { Button } from '@/components/ui/button';
import { useArrangementModal } from '@/hooks/use-arrangement-modal';
import { useDeceasedModal } from '@/hooks/use-deceased-modal';
import { useRemovalModal } from '@/hooks/use-removal-modal';
import { PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

type Props = {
  title: string;
  onClick?: () => void;
  link: 'deceased' | 'arrangement' | 'removal' | 'expense';
};

const HeaderOptions = ({ title, onClick, link }: Props) => {
  const arrangementModal = useArrangementModal();
  const deceasedModal = useDeceasedModal();
  const removalModal = useRemovalModal();
  const router = useRouter();

  const onSubmit = () => {
    switch (link) {
      case 'deceased':
        router.push('/deceased/new');
        break;
      case 'arrangement':
        arrangementModal.onOpen();
        break;
      case 'removal':
        removalModal.onOpen();
      case 'expense':
        router.push('/finance/new');
        break;
    }
  };

  return (
    <section className="flex justify-end w-full ">
      <Button
        className="w-fit p-3 text-lg flex justify-center gap-x-2 text-center"
        onClick={onSubmit}
      >
        <span>
          <PlusCircle className="h-4 w-4" />
        </span>{' '}
        {title}
      </Button>
    </section>
  );
};

export default HeaderOptions;
