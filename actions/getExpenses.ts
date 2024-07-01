import prismadb from '@/lib/prismadb';
import { Expense } from '@/types';
import { ExpCategory, SubExpCategory } from '@prisma/client';

interface Query {
  categoryId?: string;
  subCatId?: string;
}

export const getExpenses = async (query?: Query) => {
  const expenses = await prismadb.expense.findMany({
    where: {
      category: {
        id: query?.categoryId,
      },
      subCategory: {
        id: query?.subCatId,
      },
    },

    include: {
      category: true,
      subCategory: true,
    },
  });

  return expenses;
};
