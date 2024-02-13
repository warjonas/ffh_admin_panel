import prismadb from '@/lib/prismadb';

import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const coffins = await prismadb.coffin.findMany({});

    return NextResponse.json(coffins);
  } catch (error) {
    console.log('COFFINS_GET', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
