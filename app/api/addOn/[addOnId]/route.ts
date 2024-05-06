import prismadb from '@/lib/prismadb';
import { getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { addOnId: string } }
) {
  let addOn;

  if (params.addOnId === null) {
    return new NextResponse('No add-on Id', { status: 500 });
  }

  try {
    addOn = await prismadb.addOns.findFirst({
      where: {
        id: params.addOnId,
      },
    });

    return NextResponse.json(addOn);
  } catch (error) {
    console.log('ADDON_GET', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { addOnId: string } }
) {
  try {
    const session = await getSession();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();

    const { addOnName, price } = body;

    if (!addOnName) {
      return new NextResponse('Add-on name is required', {
        status: 400,
      });
    }

    const addOn = await prismadb.addOns.update({
      where: {
        id: params.addOnId,
      },
      data: {
        name: addOnName,
        price,
      },
    });

    return NextResponse.json(addOn);
  } catch (error) {
    console.log('ADDON_PATCH', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { addOnId: string } }
) {
  try {
    const session = getSession();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const addOn = await prismadb.addOns.delete({
      where: {
        id: params.addOnId,
      },
    });

    return NextResponse.json(addOn);
  } catch (error) {
    console.log('ADDON_DELETE', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
