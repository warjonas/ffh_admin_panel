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
      storage,
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
    if (!storage) {
      return new NextResponse('Storage amount is required', {
        status: 401,
      });
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

    const bodyRemoval = await prismadb.removal.create({
      data: {
        deceasedId,
        byUndertaker,
        doctorsFees,
        storageFee,
        storage,
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
      include: {
        receipts: true,
        deceased: true,
      },
    });
    const upcomingRemovals = removals.filter(async (removal) => {
      let d = new Date();
      // d.setDate(d.getDate() + 7);

      let days = await calculate_days(d, removal.dateRequested);

      if (days < 7) {
        return removal;
      }
    });

    // console.log(upcomingRemovals);

    return NextResponse.json(upcomingRemovals);
  } catch (error) {
    console.log('[REMOVAL_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
