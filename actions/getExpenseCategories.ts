import prismadb from '@/lib/prismadb';
import { ExpCategory } from '@/types';

export const getCategories = async () => {
  const categories = await prismadb.expCategory.findMany({
    include: {
      subCategories: true,
    },
  });

  return categories;
};
