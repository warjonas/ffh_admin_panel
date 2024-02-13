import prismadb from '@/lib/prismadb';

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
