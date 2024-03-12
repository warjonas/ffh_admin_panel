import prismadb from '@/lib/prismadb';
import { getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { receiptId: string } }
) {
  const session = await getSession();

  if (!session) {
    return new NextResponse('Unauthorized', { status: 500 });
  }
  if (!params.receiptId) {
    return new NextResponse('Receipt Id is required', { status: 401 });
  }

  try {
    const receipt = await prismadb.receipt.findFirst({
      where: {
        receiptNo: params.receiptId,
      },
      include: {
        removal: {
          include: {
            deceased: true,
          },
        },
        arrangement: {
          include: {
            deceased: true,
          },
        },
      },
    });

    return NextResponse.json(receipt);
  } catch (error) {
    console.log('[RECEIPT_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
