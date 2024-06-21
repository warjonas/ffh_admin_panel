import prismadb from '@/lib/prismadb';
import { getSession } from '@auth0/nextjs-auth0';

import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { subCatId: string } }
) {
  try {
    const subCategory = await prismadb.subExpCategory.findFirst({
      where: {
        id: params.subCatId,
      },
    });

    return NextResponse.json(subCategory);
  } catch (error) {
    console.log('SUBCATEGORY_GET', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
