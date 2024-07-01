import { getSubCatExpenses } from '@/actions/getSubCatExpenses';
import Heading from '@/components/ui/heading';
import prismadb from '@/lib/prismadb';
import React from 'react';
import { Client } from './components/client';

interface Props {
  params: { categoryId: string };
}

const page = async ({ params }: Props) => {
  const subCatExpenses = await getSubCatExpenses(params.categoryId);
  const category = await prismadb.expCategory.findFirst({
    where: {
      id: params.categoryId,
    },
  });

  return (
    <section className="flex flex-col w-full p-5">
      <Heading
        title={category ? category.name : 'Expenses'}
        subtitle="Viewing detailed breakdown of expenses"
      />

      <section className="flex flex-row h-full mt-5 mb-5">
        <div className="w-3/4  h-full">
          <Client data={subCatExpenses} />
        </div>
      </section>
    </section>
  );
};

export default page;
