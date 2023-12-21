import { PrismaClient } from '@prisma/client';

const prismadb = new PrismaClient();

async function main() {
  await prismadb.coffin.createMany({
    data: [
      {
        name: 'Flat Lid',
        price: 1200,
      },
      {
        name: '3 tier coffin',
        price: 2500,
      },

      {
        name: 'Pongee Casket',
        price: 5000,
      },
    ],
  });

  const coffins = await prismadb.coffin.findMany({});
  console.dir(coffins, { depth: null });
}

main()
  .then(async () => {
    await prismadb.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prismadb.$disconnect();
    process.exit(1);
  });
