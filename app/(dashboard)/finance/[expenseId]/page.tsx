import { getCategories } from '@/actions/getExpenseCategories';
import Heading from '@/components/ui/heading';
import React from 'react';
import ExpenseForm from '../components/expense-form';
import { getSubCategories } from '@/actions/getSubCategories';
import prismadb from '@/lib/prismadb';

type Props = {};

const Expense = async (props: Props) => {
  const categories = await getCategories();
  const subCategories = await getSubCategories();
  const vehicles = await prismadb.vehicle.findMany({});

  return (
    <section className="p-5 w-full h-full">
      <Heading title="New Expense" subtitle="Add new expense record" />
      <section className="py-2">
        <ExpenseForm
          categories={categories}
          subCategories={subCategories}
          vehicles={vehicles}
        />
      </section>
    </section>
  );
};

export default Expense;
