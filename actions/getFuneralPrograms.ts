import prismadb from '@/lib/prismadb';

export const getFuneralProgram = async (programId: string) => {
  const arrangement = await prismadb.funeralProgram.findFirst({
    where: {
      id: programId,
    },
    include: {
      deceased: true,
    },
    orderBy: {
      deceased: {
        dateOfDeath: 'asc',
      },
    },
  });

  return arrangement;
};
