import prismadb from '@/lib/prismadb';

export const getPopularCoffin = async () => {
  const popCoffin = await prismadb.coffin.findMany({
    take: 1,
    include: {
      arrangements: true,
    },
    orderBy: [
      {
        arrangements: {
          _count: 'desc',
        },
      },
      {
        coffinName: 'asc',
      },
    ],
  });

  return popCoffin;
};
