import prismadb from '@/lib/prismadb';
import { getSession } from '@auth0/nextjs-auth0';

import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const crosses = await prismadb.crossSize.findMany({});

    return NextResponse.json(crosses);
  } catch (error) {
    console.log('CROSSES_GET', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getSession();

  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const body = await req.json();

  const { size, price } = body;

  if (!size) {
    return new NextResponse('Cross Size is required', {
      status: 400,
    });
  }
  if (!price) {
    return new NextResponse('Cross Price is required', {
      status: 400,
    });
  }

  try {
    const crossSize = await prismadb.crossSize.create({
      data: {
        size,
        price,
      },
    });

    return NextResponse.json(crossSize);
  } catch (error) {
    console.log('CROSSSIZE_POST');
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
