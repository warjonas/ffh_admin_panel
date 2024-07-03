'use server';

import prismadb from '@/lib/prismadb';

interface Props {
  subId: string;
}

export const getSubCategory = async ({ subId }: Props) => {
  const subName = await prismadb.subExpCategory.findFirst({
    where: {
      id: subId,
    },
    include: {
      expCategory: true,
      expenses: true,
    },
  });

  return subName;
};
