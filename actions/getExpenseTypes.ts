import prismadb from '@/lib/prismadb';
import { ExpCategory } from '@/types';

interface Query {}

export const getExpenseTypes = async () => {
  const expenseTypes = await prismadb.expense.findMany({
    include: {
      category: true,
      subCategory: true,
    },
  });

  return expenseTypes;
};
