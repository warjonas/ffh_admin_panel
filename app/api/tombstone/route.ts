import prismadb from '@/lib/prismadb';
import { getSession } from '@auth0/nextjs-auth0';

import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const tombstones = await prismadb.tombstone.findMany({});

    return NextResponse.json(tombstones);
  } catch (error) {
    console.log('TOMBSTONES_GET', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: Request) {
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

    const tombstone = await prismadb.tombstone.create({
      data: {
        type,
        tombstoneName,
        price,
      },
    });

    return NextResponse.json(tombstone);
  } catch (error) {
    console.log('TOMBSTONE_POST', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
