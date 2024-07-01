import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const mostRecent = await prismadb.expense.findMany({
      take: 1,

      orderBy: {
        createdOn: 'desc',
      },
    });

    return NextResponse.json(mostRecent);
  } catch (error) {
    console.log('MOSTREC_GET', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
