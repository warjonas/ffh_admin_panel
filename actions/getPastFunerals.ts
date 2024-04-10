import prismadb from '@/lib/prismadb';

export const getPastFunerals = async () => {
  const arrangements = await prismadb.arrangement.findMany({
    where: {
      dateOfFuneralService: {
        lt: new Date(),
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
