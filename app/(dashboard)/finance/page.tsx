import HeaderOptions from '@/components/ui/header-options';
import Heading from '@/components/ui/heading';
import React, { Suspense } from 'react';
import Loading from '../Loading';
import { ExpenseClient } from './components/client';
import { getExpenseTypes } from '@/actions/getExpenseTypes';
import { ExpenseColumn } from './components/columns';
import { getExpenses } from '@/actions/getExpenses';
import { getCategories } from '@/actions/getExpenseCategories';
import { getSubCategories } from '@/actions/getSubCategories';

interface ExpenseViewProps {
  searchParams: {
    categoryId: string;
    subCatId: string;
  };
}

const Finance = async ({ searchParams }: ExpenseViewProps) => {
  const expenses = await getExpenses({
    categoryId: searchParams.categoryId,
    subCatId: searchParams.subCatId,
  });

  const formattedExpenses: ExpenseColumn[] = expenses.map((item) => ({
    id: item.id,
    amount: item.cost,
    category: item.category.name,
    description: item.description,
    sub_category: item.subCategory.name,
    created: new Date(item.createdOn),
  }));

  const categories = await getCategories();

  const subCategories = await getSubCategories(searchParams.categoryId);

  return (
    <section className="p-5 w-full h-full">
      <Suspense fallback={<Loading />}>
        <Heading title="Expenses" subtitle="Add and Track Expenses" />
        <section>
          <div className="flex justify-between">
            <HeaderOptions title="New Expense" link="expense" />
          </div>
        </section>

        <section className="flex flex-row h-full mt-5 mb-5">
          <div className="w-3/4  h-full">
            <ExpenseClient
              data={formattedExpenses}
              categories={categories}
              subCategories={subCategories}
            />
          </div>
        </section>
      </Suspense>
    </section>
  );
};

export default Finance;
