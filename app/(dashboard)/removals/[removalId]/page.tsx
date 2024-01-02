import prismadb from '@/lib/prismadb';
import React from 'react';
import RemovalForm from './components/removalForm';

interface Props {
  params: { removalId: string };
}

const page = async ({ params }: Props) => {
  let removal = null;

  if (params.removalId !== 'new') {
    removal = await prismadb.removal.findUnique({
      where: {
        id: params.removalId,
      },
    });
  }

  return (
    <div className="min-h-screen w-full p-5 overflow-auto mb-20">
      <RemovalForm initialData={removal} />
    </div>
  );
};

export default page;
