import prismadb from '@/lib/prismadb';
import { Arrangement } from '@prisma/client';

export const getArrangement = async (arrangementId: string) => {
  const arrangement = await prismadb.arrangement.findFirst({
    where: {
      id: arrangementId,
    },
    include: {
      tombstone: true,
      coffin: true,
      deceased: true,
    },
    orderBy: {
      deceased: {
        dateOfDeath: 'desc',
      },
    },
  });

  return arrangement;
};
