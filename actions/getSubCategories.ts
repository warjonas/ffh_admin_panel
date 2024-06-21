import prismadb from '@/lib/prismadb';
import { SubExpCategory } from '@/types';
import { Arrangement } from '@prisma/client';

export const getSubCategories = async (catId: string) => {
  const subCategories = await prismadb.subExpCategory.findMany({
    where: {
      expCategory: {
        id: catId,
      },
    },
  });

  console.log('subs', subCategories);

  return subCategories;
};
