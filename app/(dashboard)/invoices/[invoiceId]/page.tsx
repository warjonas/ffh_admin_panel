import Heading from '@/components/ui/heading';
import prismadb from '@/lib/prismadb';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import InvoiceForm from './component/invoiceForm';

interface Props {
  params: { invoiceId: string };
}

const page = async ({ params }: Props) => {
  let invoice = null;

  if (params.invoiceId !== 'new') {
    invoice = await prismadb.invoice.findFirst({
      where: {
        id: params.invoiceId,
      },
    });
  }

  return (
    <section className="flex flex-col w-full p-5">
      <Heading
        title="Create new Customer Invoice"
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
        <InvoiceForm initialData={invoice} params={params} />
      </section>
    </section>
  );
};

export default page;
