import prismadb from '@/lib/prismadb';
import { getSession } from '@auth0/nextjs-auth0';

import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const subCategories = await prismadb.subExpCategory.findMany({});

    return NextResponse.json(subCategories);
  } catch (error) {
    console.log('SUBCATEGORIES_GET', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getSession();

  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const body = await req.json();

  const { name, expCatId } = body;

  if (!name) {
    return new NextResponse('Category name is required', {
      status: 400,
    });
  }

  if (!expCatId) {
    return new NextResponse('Expense Main Category is required', {
      status: 400,
    });
  }

  try {
    const subCategory = await prismadb.subExpCategory.create({
      data: {
        name,
        expCategory: {
          connect: {
            id: expCatId,
          },
        },
      },
    });

    return NextResponse.json(subCategory);
  } catch (error) {
    console.log('SUBCATEGORY_POST');
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
