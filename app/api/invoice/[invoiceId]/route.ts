import { generateId } from '@/actions/getInvoiceId';
import prismadb from '@/lib/prismadb';
import { getSession } from '@auth0/nextjs-auth0';

import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { invoiceId: string } }
) {
  try {
    const invoices = await prismadb.invoice.findFirst({
      where: {
        invoiceNo: params.invoiceId,
      },
      include: {
        receipts: true,
      },
    });

    return NextResponse.json(invoices);
  } catch (error) {
    console.log('INVOICE_GET', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { invoiceId: string } }
) {
  try {
    const session = await getSession();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();

    const {
      dueDate,
      paymentReference,
      customerDetails,
      invoiceItems,
      total,
      createdBy,
      discount,
    } = body;

    const invoice = await prismadb.invoice.update({
      where: {
        invoiceNo: params.invoiceId,
      },
      data: {
        invoiceItems,
        dueDate,
        customerDetails,
        paymentReference,
        total,
        createdBy,
        discount,
      },
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.log('[INVOICE_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { invoiceId: string } }
) {
  const body = await req.json();

  try {
    const session = await getSession();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const invoice = await prismadb.invoice.update({
      where: {
        invoiceNo: params.invoiceId,
      },
      data: {
        flagDelete: true,
      },
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.log('INVOICE_DELETE', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
