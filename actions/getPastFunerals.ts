import prismadb from '@/lib/prismadb';

export const getPastFunerals = async () => {
  const arrangements = await prismadb.arrangement.findMany({
    where: {
      dateOfFuneralService: {
        lt: new Date(),
        gte: new Date(new Date(new Date().getFullYear(), 0, 1)),
      },
    },
    include: {
      deceased: true,
    },
    orderBy: {
      dateOfFuneralService: 'asc',
    },
  });

  return arrangements;
};
