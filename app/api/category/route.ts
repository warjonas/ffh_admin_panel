import prismadb from '@/lib/prismadb';
import { getSession } from '@auth0/nextjs-auth0';

import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const expCategories = await prismadb.expCategory.findMany({});

    return NextResponse.json(expCategories);
  } catch (error) {
    console.log('EXPCATEGORIES_GET', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getSession();

  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const body = await req.json();

  const { name, price } = body;

  if (!name) {
    return new NextResponse('Category name is required', {
      status: 400,
    });
  }

  try {
    const expCategory = await prismadb.expCategory.create({
      data: {
        name,
      },
    });

    return NextResponse.json(expCategory);
  } catch (error) {
    console.log('EXPCATEGORY_POST');
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
