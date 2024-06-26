import prismadb from '@/lib/prismadb';
import { getSession } from '@auth0/nextjs-auth0';

import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { expCatId: string } }
) {
  try {
    const subCategory = await prismadb.subExpCategory.findMany({
      where: {
        expCategory: { id: params.expCatId },
      },
    });

    return NextResponse.json(subCategory);
  } catch (error) {
    console.log('SUBCATEGORIES_GET', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
