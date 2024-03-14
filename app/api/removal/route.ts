import { generateId } from '@/actions/getInvoiceId';
import { calculate_days } from '@/actions/getUpcomingRemovals';
import prismadb from '@/lib/prismadb';
import { getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const body = await req.json();

    const {
      deceasedId,
      byUndertaker,
      doctorsFees,
      storageFee,

      copyFee,
      copies,
      graveFee,
      gravediggerCost,
      adminFees,
      totalDue,
      scheduledBy,
      deathRegistration,
      dateRequested,
    } = body;

    if (!byUndertaker) {
      return new NextResponse('Undertaker name is required', { status: 401 });
    }
    if (!doctorsFees) {
      return new NextResponse('Doctor fee is required', { status: 401 });
    }
    if (!dateRequested) {
      return new NextResponse('Date requested is required', { status: 401 });
    }

    if (!deathRegistration) {
      return new NextResponse('Death Registration fee is required', {
        status: 401,
      });
    }
    if (!storageFee) {
      return new NextResponse('Storage fee is required', { status: 401 });
    }

    if (!copyFee) {
      return new NextResponse('Copy Fee is required', { status: 401 });
    }
    if (!copies) {
      return new NextResponse('Amount of Copies is required', { status: 401 });
    }
    if (!graveFee) {
      return new NextResponse('Grave fee is required', { status: 401 });
    }

    if (!gravediggerCost) {
      return new NextResponse('Gravedigger cost is required', { status: 401 });
    }
    if (!adminFees) {
      return new NextResponse('Admin fee is required', { status: 401 });
    }
    if (!totalDue) {
      return new NextResponse('Total Due is required', { status: 401 });
    }

    const invoiceNo = await generateId('INV');

    const bodyRemoval = await prismadb.removal.create({
      data: {
        invoiceNo,
        outstandingBalance: totalDue,
        deceased: {
          connect: {
            id: deceasedId,
          },
        },
        byUndertaker,
        doctorsFees,
        storageFee,
        copyFee,
        copies,
        graveFee,
        gravediggerCost,
        adminFees,
        totalDue,
        scheduledBy,
        deathRegistration,
        dateRequested,
      },
    });

    return NextResponse.json(bodyRemoval);
  } catch (error) {
    console.log('[REMOVAL_POST]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET(req: Request) {
  const session = await getSession();

  if (!session) {
    return new NextResponse('Unauthorized', { status: 500 });
  }

  try {
    const removals = await prismadb.removal.findMany({
      where: {
        deceased: {
          flagDelete: false,
        },
      },
      include: {
        receipts: true,
        deceased: true,
      },
    });

    return NextResponse.json(removals);
  } catch (error) {
    console.log('[REMOVAL_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
