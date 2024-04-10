import prismadb from '@/lib/prismadb';

export const getUpcomingFunerals = async () => {
  const arrangements = await prismadb.arrangement.findMany({
    where: {
      dateOfFuneralService: {
        gt: new Date(),
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
