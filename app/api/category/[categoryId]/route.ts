import { generateId } from '@/actions/getInvoiceId';
import prismadb from '@/lib/prismadb';
import { getSession } from '@auth0/nextjs-auth0';
import { FamilyRep } from '@prisma/client';
import { ObjectId } from 'bson';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { expCatId: string } }
) {
  let expCategory;

  if (params.expCatId === null) {
    return new NextResponse('No expense category Id', { status: 500 });
  }

  try {
    expCategory = await prismadb.expCategory.findFirst({
      where: {
        id: params.expCatId,
      },
    });

    return NextResponse.json(expCategory);
  } catch (error) {
    console.log('EXPCATEGORY_GET', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    const session = await getSession();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();

    const { name } = body;

    if (!name) {
      return new NextResponse('Expense Category name is required', {
        status: 400,
      });
    }

    const expCategory = await prismadb.expCategory.update({
      where: {
        id: params.categoryId,
      },
      data: {
        name,
      },
    });

    return NextResponse.json(expCategory);
  } catch (error) {
    console.log('EXPCATEGORY_PATCH', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { graveId: string } }
) {
  try {
    const session = getSession();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const grave = await prismadb.grave.delete({
      where: {
        id: params.graveId,
      },
    });

    return NextResponse.json(grave);
  } catch (error) {
    console.log('EXPCATEGORY_DELETE', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
