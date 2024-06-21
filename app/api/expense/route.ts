import prismadb from '@/lib/prismadb';
import { getSession } from '@auth0/nextjs-auth0';

import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const expenses = await prismadb.expense.findMany({});

    return NextResponse.json(expenses);
  } catch (error) {
    console.log('EXPENSES_GET', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getSession();

  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const body = await req.json();

  const { graveName, price } = body;

  if (!graveName) {
    return new NextResponse('Grave name is required', {
      status: 400,
    });
  }

  try {
    const grave = await prismadb.grave.create({
      data: {
        graveName,
        price,
      },
    });

    return NextResponse.json(grave);
  } catch (error) {
    console.log('GRAVE_POST');
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
