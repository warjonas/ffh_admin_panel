import prismadb from '@/lib/prismadb';
import { getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const session = await getSession();

  if (!session) {
    return new NextResponse('Unauthorized', { status: 500 });
  }

  try {
    const receipts = await prismadb.receipt.findMany({
      include: {
        removal: {
          include: {
            deceased: true,
          },
        },
        arrangement: {
          include: {
            deceased: true,
          },
        },
      },
    });

    return NextResponse.json(receipts);
  } catch (error) {
    console.log('[RECEIPTS_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
