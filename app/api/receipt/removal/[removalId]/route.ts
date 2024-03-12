import { generateId } from '@/actions/getInvoiceId';
import prismadb from '@/lib/prismadb';
import { getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { removalId: string } }
) {}

export async function POST(
  req: Request,
  { params }: { params: { removalId: string } }
) {
  const session = await getSession();
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  if (!params.removalId) {
    return new NextResponse('Unauthorized. Removal ID is required', {
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

    if (!paidUp) {
      return new NextResponse('Paid Up is required', { status: 401 });
    }

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

    const [bodyRemovalReceipt, bodyRemoval] = await prismadb.$transaction([
      prismadb.receipt.create({
        data: {
          date: new Date(),
          issuedBy,
          receivedFrom,

          invoiceId: params.removalId,
          receivedAmount,
          methodOfPayment,
          receiptNo,
        },
      }),
      prismadb.removal.update({
        where: {
          id: params.removalId,
        },
        data: {
          paidUp,
          outstandingBalance,
        },
      }),
    ]);

    return NextResponse.json(bodyRemovalReceipt, { status: 200 });
  } catch (error) {
    console.log('[REMOVAL_RECEIPT_POST]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
