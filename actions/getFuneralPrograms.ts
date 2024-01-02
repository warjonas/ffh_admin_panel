import prismadb from '@/lib/prismadb';

export const getFuneralProgram = async (programId: string) => {
  const arrangement = await prismadb.funeralProgram.findFirst({
    where: {
      id: programId,
    },
    include: {
      tombstone: true,
      coffin: true,
    },
    orderBy: {
      dateOfDeath: 'desc',
    },
  });

  return arrangement;
};
