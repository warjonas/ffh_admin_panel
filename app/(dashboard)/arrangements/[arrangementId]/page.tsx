import Heading from '@/components/ui/heading';
import prismadb from '@/lib/prismadb';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import AddArrangementForm from './components/arrangementForm';

interface Props {
  params: { arrangementId: string };
}

const page = async ({ params }: Props) => {
  let arrangement = null;

  if (params.arrangementId !== 'new') {
    arrangement = await prismadb.arrangement.findFirst({
      where: {
        id: params.arrangementId,
      },
      include: {
        deceased: true,
      },
    });
  }

  const deceasedData = await prismadb.deceased.findMany({
    where: {
      flagDelete: false,
    },
    include: {
      arrangement: {
        include: {
          grave: true,
          tombstone: true,
          coffin: true,
        },
      },
      removal: true,
    },
  });

  const addOnsData = await prismadb.addOns.findMany({});

  const tombstones = await prismadb.tombstone.findMany({});

  const graves = await prismadb.grave.findMany({});

  const coffins = await prismadb.coffin.findMany({});

  const crosses = await prismadb.crossSize.findMany({});

  let headingText;

  if (arrangement) {
    headingText = 'Create New Funeral Arrangement';
  } else {
    headingText = 'Update Funeral Arrangement';
  }

  return (
    <section className="flex flex-col w-full p-5">
      <Heading
        title={headingText}
        subtitle="Complete all required information"
      />
      <Link
        href={'/arrangements'}
        className="flex flex-row w-fit hover:cursor-pointer"
      >
        {' '}
        <ChevronLeft /> Back
      </Link>

      <section className="w-1/2 h-full">
        <AddArrangementForm
          initialData={arrangement}
          addOnData={addOnsData}
          coffins={coffins}
          crosses={crosses}
          deceasedData={deceasedData}
          graves={graves}
          tombstones={tombstones}
          params={params}
        />
      </section>
    </section>
  );
};

export default page;
