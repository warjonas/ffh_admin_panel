import HeaderOptions from '@/components/ui/header-options';
import Heading from '@/components/ui/heading';
import React, { Suspense } from 'react';
import Loading from '../Loading';
import { ExpenseClient } from './components/client';
import { getExpenses } from '@/actions/getExpenses';
import { ExpenseColumn } from './components/columns';

type Props = {};

const Finance = async (props: Props) => {
  const expenses = await getExpenses();

  const formattedExpenses: ExpenseColumn[] = expenses.map((item) => ({
    id: item.id,
    amount: item.cost,
    category: item.category.name,
    description: item.description,
    sub_category: item.subCategory.name,
    created: new Date(item.createdOn),
  }));

  return (
    <section className="p-5 w-full h-full">
      <Suspense fallback={<Loading />}>
        <Heading title="Finances" subtitle="Add and Track Expenses" />
        <section>
          <div className="flex justify-between">
            <HeaderOptions title="New Expense" link="expense" />
          </div>
        </section>

        <section className="flex flex-row h-full mt-5 mb-5">
          <div className="w-3/4 xl:w-2/3 h-full">
            <ExpenseClient data={formattedExpenses} />
          </div>
        </section>
      </Suspense>
    </section>
  );
};

export default Finance;
