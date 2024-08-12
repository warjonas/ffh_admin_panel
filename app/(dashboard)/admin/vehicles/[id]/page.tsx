import { getSubCatExpenses } from '@/actions/getSubCatExpenses';
import Heading from '@/components/ui/heading';
import prismadb from '@/lib/prismadb';
import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { getVehicle } from '@/actions/getVehicle';

interface Props {
  params: { id: string };
}

const page = async ({ params }: Props) => {
  const vehicle = await getVehicle(params);

  return (
    <section className="flex flex-col w-full p-5">
      <Heading
        title={`Vehicle: ${vehicle?.model + ' - ' + vehicle?.registration}`}
        subtitle="Manage individual vehicle details"
      />
      <Link
        href={'/admin#vehicles'}
        className="flex flex-row hover:cursor-pointer"
      >
        {' '}
        <ChevronLeft /> Back
      </Link>
      <section className="flex flex-col gap-y-10 h-full mt-5 mb-5">
        <div className="md:w-1/2 lg:w-1/3  h-full flex flex-row gap-y-4 border justify-between border-gray-300 p-5">
          <section className="flex flex-col gap-y-4 justify-between">
            <h2>
              <span className="font-semibold">Model</span>: {vehicle?.model}
            </h2>
            <h2>
              <span className="font-semibold">Registration</span>:{' '}
              {vehicle?.registration}
            </h2>
            <h2>
              <span className="font-semibold">Color</span>: {vehicle?.colour}
            </h2>
            <h2>
              <span className="font-semibold">Odometer</span>:{' '}
              {vehicle?.odometer} KM
            </h2>
            <h2 className="flex flex-row gap-x-2">
              <span className="font-semibold">Available:</span>{' '}
              {vehicle?.available ? (
                <div className="h-6 w-6 rounded-full border-white border-2 bg-green-500 shadow"></div>
              ) : (
                <div className="h-6 w-6 rounded-full border-white border-2 bg-red-700 shadow"></div>
              )}
            </h2>
          </section>
          <section>
            <div className="w-40 h-40 p-5 border flex text-center border-gray-300 items-center justify-center shadow-md rounded-md">
              Picture placeholder
            </div>
          </section>
        </div>

        <div className="md:w-1/2 lg:w-1/3  h-full flex flex-col gap-y-4 border justify-between border-gray-300 p-5">
          <h1 className="text-lg">Vehicle Logs</h1>
          <hr className="w-full" />
          {vehicle?.logs ? <h2>List of logs</h2> : <h2> No Logs available</h2>}
        </div>
      </section>
    </section>
  );
};

export default page;
