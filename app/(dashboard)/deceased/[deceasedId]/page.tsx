import { getSubCatExpenses } from '@/actions/getSubCatExpenses';
import Heading from '@/components/ui/heading';
import prismadb from '@/lib/prismadb';
import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { getVehicle } from '@/actions/getVehicle';
import DeceasedForm from './components/DeceasedForm';

interface Props {
  params: { deceasedId: string };
}

const page = async ({ params }: Props) => {
  let deceased = null;

  if (params.deceasedId !== 'new') {
    deceased = await prismadb.deceased.findUniqueOrThrow({
      where: {
        id: params.deceasedId,
      },
    });
  }

  return (
    <section className="flex flex-col w-full p-5">
      <Heading
        title="Upload Deceased Person"
        subtitle="Complete all required information"
      />
      <Link
        href={'/deceased'}
        className="flex flex-row w-fit hover:cursor-pointer"
      >
        {' '}
        <ChevronLeft /> Back
      </Link>

      <section className="w-full h-full">
        <DeceasedForm deceasedDetails={deceased} />
      </section>
    </section>
  );
};

export default page;
