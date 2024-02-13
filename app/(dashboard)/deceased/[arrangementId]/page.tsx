import React from 'react';
import ArrangementForm from './components/arrangement-form';
import prismadb from '@/lib/prismadb';
import { ObjectId } from 'bson';

type Props = {
  params: { arrangementId: string };
};

const page = async ({ params }: Props) => {
  let arrangement = null;

  if (params.arrangementId !== 'new') {
    arrangement = await prismadb.arrangement.findUnique({
      where: {
        id: params.arrangementId,
      },
    });
  }

  const coffins = await prismadb.coffin.findMany({});

  const tombstones = await prismadb.tombstone.findMany({});

  return (
    <div className="min-h-screen w-full p-5 overflow-auto mb-20">
      <ArrangementForm
        initialData={arrangement}
        coffins={coffins}
        tombstones={tombstones}
      />
    </div>
  );
};

export default page;
