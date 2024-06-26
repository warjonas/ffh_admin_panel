import prismadb from '@/lib/prismadb';
import { ExpCategory } from '@/types';

export const getExpenses = async () => {
  const categories = await prismadb.expense.findMany({
    include: {
      category: true,
      subCategory: true,
    },
  });

  return categories;
};
