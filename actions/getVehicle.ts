'use server';

import prismadb from '@/lib/prismadb';

interface Props {
  id: string;
}

export const getVehicle = async ({ id }: Props) => {
  const vehicle = await prismadb.vehicle.findFirst({
    where: {
      id,
    },
    include: {
      logs: true,
    },
  });

  return vehicle;
};
