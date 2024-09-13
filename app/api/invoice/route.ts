import { generateId } from '@/actions/getInvoiceId';
import prismadb from '@/lib/prismadb';
import { getSession } from '@auth0/nextjs-auth0';

import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const invoices = await prismadb.invoice.findMany({
      include: {
        receipts: true,
      },
    });

    return NextResponse.json(invoices);
  } catch (error) {
    console.log('INVOICES_GET', error);
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

    const {
      dueDate,
      paymentReference,
      customerDetails,
      invoiceItems,
      total,
      createdBy,
      discount,
    } = body;

    const invoiceNo = await generateId('INV');

    const invoice = await prismadb.invoice.create({
      data: {
        invoiceNo,
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
    console.log('[INVOICE_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
