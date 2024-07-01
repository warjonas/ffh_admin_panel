import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const categories = await prismadb.expCategory.findMany({
      take: 1,
      include: {
        expenses: true,
      },
      orderBy: {
        expenses: {
          _count: 'desc',
        },
      },
    });
    const popCat = categories[0].name;

    return NextResponse.json(popCat);
  } catch (error) {
    console.log('POPCAT_GET', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
