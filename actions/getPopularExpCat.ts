'use server';

import prismadb from '@/lib/prismadb';

export const getPopularExpCat = async () => {
  const popCat = await prismadb.expCategory.findMany({
    take: 1,
    include: {
      expenses: true,
    },
    orderBy: {
      expenses: {
        _count: 'desc',
      },
    },
  });

  return popCat;
};
