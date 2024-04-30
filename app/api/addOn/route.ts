import prismadb from '@/lib/prismadb';
import { getSession } from '@auth0/nextjs-auth0';

import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const addOns = await prismadb.addOns.findMany({});

    return NextResponse.json(addOns);
  } catch (error) {
    console.log('ADDONS_GET', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getSession();

  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const body = await req.json();

  const { addOnName, price } = body;

  if (!addOnName) {
    return new NextResponse('Add on name is required', {
      status: 400,
    });
  }

  try {
    const addOn = await prismadb.addOns.create({
      data: {
        name: addOnName,
        price,
      },
    });

    return NextResponse.json(addOn);
  } catch (error) {
    console.log('ADDON_POST', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
