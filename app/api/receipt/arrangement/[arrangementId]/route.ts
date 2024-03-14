import { generateId } from '@/actions/getInvoiceId';
import prismadb from '@/lib/prismadb';
import { getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { arrangementId: string } }
) {}

export async function POST(
  req: Request,
  { params }: { params: { arrangementId: string } }
) {
  const session = await getSession();
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  if (!params.arrangementId) {
    return new NextResponse('Unauthorized. arrangementId ID is required', {
      status: 401,
    });
  }

  try {
    const body = await req.json();

    const {
      issuedBy,
      receivedFrom,
      receivedAmount,
      methodOfPayment,
      outstandingBalance,
      paidUp,
    } = body;

    if (!issuedBy) {
      return new NextResponse('Issurer name is required', { status: 401 });
    }

    if (!receivedFrom) {
      return new NextResponse('Payer name is required', { status: 401 });
    }

    if (!receivedAmount) {
      return new NextResponse('Amount Received is required', { status: 401 });
    }

    if (!methodOfPayment) {
      return new NextResponse('Method of Payment is required', { status: 401 });
    }

    // if (!outstandingBalance) {
    //   return new NextResponse('Outstanding balance is required', {
    //     status: 401,
    //   });
    // }

    const receiptNo = await generateId('REC');

    const [arrangementlReceipt, arrangement] = await prismadb.$transaction([
      prismadb.receipt.create({
        data: {
          date: new Date(),
          issuedBy,
          receivedFrom,

          invoiceId: params.arrangementId,
          receivedAmount,
          methodOfPayment,
          receiptNo,
        },
      }),
      prismadb.arrangement.update({
        where: {
          id: params.arrangementId,
        },
        data: {
          paidUp,
          outstandingBalance,
        },
      }),
    ]);

    return NextResponse.json(arrangementlReceipt, { status: 200 });
  } catch (error) {
    console.log('[ARRANGEMENT_RECEIPT_POST]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
