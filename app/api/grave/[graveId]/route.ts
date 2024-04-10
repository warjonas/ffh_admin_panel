import { generateId } from '@/actions/getInvoiceId';
import prismadb from '@/lib/prismadb';
import { getSession } from '@auth0/nextjs-auth0';
import { FamilyRep } from '@prisma/client';
import { ObjectId } from 'bson';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { graveId: string } }
) {
  let grave;

  if (params.graveId === null) {
    return new NextResponse('No grave Id', { status: 500 });
  }

  try {
    grave = await prismadb.grave.findFirst({
      where: {
        id: params.graveId,
      },
    });

    return NextResponse.json(grave);
  } catch (error) {
    console.log('GRAVE_SINGLE_GET', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { graveId: string } }
) {
  try {
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

    const deceased = await prismadb.grave.update({
      where: {
        id: params.graveId,
      },
      data: {
        graveName,
        price,
      },
    });

    return NextResponse.json(deceased);
  } catch (error) {
    console.log('Coffin_PATCH', error);
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
    console.log('GRAVE_DELETE', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
