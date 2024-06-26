import prismadb from '@/lib/prismadb';
import { SubExpCategory } from '@/types';
import { Arrangement } from '@prisma/client';

export const getSubCategories = async (catId?: string) => {
  const subCategories = await prismadb.subExpCategory.findMany({
    include: {
      expCategory: true,
    },
  });

  return subCategories;
};
