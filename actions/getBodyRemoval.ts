import prismadb from '@/lib/prismadb';

export const getBodyRemoval = async (removalId: string) => {
  const arrangement = await prismadb.removal.findFirst({
    where: {
      id: removalId,
    },
    include: {
      receipts: true,
    },
    orderBy: {
      dateRemoved: 'desc',
    },
  });

  return arrangement;
};
