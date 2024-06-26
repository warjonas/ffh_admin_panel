import { generateId } from '@/actions/getInvoiceId';
import prismadb from '@/lib/prismadb';
import { getSession } from '@auth0/nextjs-auth0';

import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { coffinId: string } }
) {
  let coffin;

  if (params.coffinId === null) {
    return new NextResponse('No coffin Id', { status: 500 });
  }

  try {
    coffin = await prismadb.coffin.findFirst({
      where: {
        id: params.coffinId,
      },
    });

    return NextResponse.json(coffin);
  } catch (error) {
    console.log('COFFIN_SINGLE_GET', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { coffinId: string } }
) {
  try {
    const session = await getSession();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();

    const { coffinName, price } = body;

    if (!coffinName) {
      return new NextResponse('Coffin name is required', {
        status: 400,
      });
    }
    if (!price) {
      return new NextResponse('Coffin Price is required', {
        status: 400,
      });
    }

    const deceased = await prismadb.coffin.update({
      where: {
        id: params.coffinId,
      },
      data: {
        coffinName,
        price,
      },
    });

    return NextResponse.json(deceased);
  } catch (error) {
    console.log('COFFIN_PATCH', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { crossId: string } }
) {
  try {
    const session = getSession();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const cross = await prismadb.crossSize.delete({
      where: {
        id: params.crossId,
      },
    });

    return NextResponse.json(cross);
  } catch (error) {
    console.log('CROSS_DELETE', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
