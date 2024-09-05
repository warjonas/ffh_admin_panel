import Heading from '@/components/ui/heading';
import prismadb from '@/lib/prismadb';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import RemovalForm from './components/removalForm';

interface Props {
  params: { removalId: string };
}

const page = async ({ params }: Props) => {
  let removal = null;

  if (params.removalId !== 'new') {
    removal = await prismadb.removal.findFirst({
      where: {
        id: params.removalId,
      },
      include: {
        deceased: true,
      },
    });
  }

  const deceasedData = await prismadb.deceased.findMany({});

  return (
    <section className="flex flex-col w-full p-5">
      <Heading
        title="Schedule Body Removal Details"
        subtitle="Complete all required information"
      />
      <Link
        href={'/removals'}
        className="flex flex-row w-fit hover:cursor-pointer"
      >
        {' '}
        <ChevronLeft /> Back
      </Link>
      <hr className="my-3 w-full border-primary border-slate-200" />

      <section className="w-full h-full">
        <RemovalForm
          initialData={removal}
          deceasedData={deceasedData}
          params={params}
        />
      </section>
    </section>
  );
};

export default page;
