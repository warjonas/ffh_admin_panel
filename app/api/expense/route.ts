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

  const { description, cost, subCat, category } = body;

  if (!description) {
    return new NextResponse('Expense description is required', {
      status: 400,
    });
  }

  if (!cost) {
    return new NextResponse('Expense cost is required', {
      status: 400,
    });
  }

  if (!subCat) {
    return new NextResponse('Sub Category is required', {
      status: 400,
    });
  }

  if (!category) {
    return new NextResponse('Category is required', {
      status: 400,
    });
  }

  try {
    const expense = await prismadb.expense.create({
      data: {
        description,
        cost,
        category: {
          connect: {
            id: category,
          },
        },
        subCategory: {
          connect: {
            id: subCat,
          },
        },
      },
    });

    return NextResponse.json(expense);
  } catch (error) {
    console.log('EXPENSE_POST');
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
