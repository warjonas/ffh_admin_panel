import { generateId } from '@/actions/getInvoiceId';
import prismadb from '@/lib/prismadb';
import { getSession } from '@auth0/nextjs-auth0';
import { FamilyRep } from '@prisma/client';
import { ObjectId } from 'bson';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { tombstoneId: string } }
) {
  let tombstone;

  if (params.tombstoneId === null) {
    return new NextResponse('No tombstone Id', { status: 500 });
  }

  try {
    tombstone = await prismadb.tombstone.findFirst({
      where: {
        id: params.tombstoneId,
      },
    });

    return NextResponse.json(tombstone);
  } catch (error) {
    console.log('TOMBSTONE_SINGLE_GET', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { tombstoneId: string } }
) {
  try {
    const session = await getSession();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();

    const { type, tombstoneName, price } = body;

    if (!type) {
      return new NextResponse('Tombstone Type is required', {
        status: 400,
      });
    }
    if (!tombstoneName) {
      return new NextResponse('Tombstone Name is required', {
        status: 400,
      });
    }
    if (!price) {
      return new NextResponse('Tombstone Price is required', {
        status: 400,
      });
    }

    const tombstone = await prismadb.tombstone.update({
      where: {
        id: params.tombstoneId,
      },
      data: {
        type,
        tombstoneName,
        price,
      },
    });

    return NextResponse.json(tombstone);
  } catch (error) {
    console.log('TOMBSTONE_PATCH', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { tombstoneId: string } }
) {
  try {
    const session = getSession();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const tombstone = await prismadb.tombstone.delete({
      where: {
        id: params.tombstoneId,
      },
    });

    return NextResponse.json(tombstone);
  } catch (error) {
    console.log('TOMBSTONE_DELETE', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
