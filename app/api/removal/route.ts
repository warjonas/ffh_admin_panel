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
      lastname,
      firstName,
      idNumber,
      address,
      dateRemoved,
      byUndertaker,
      doctorsFees,
      storageFee,
      storageDays,
      copyFee,
      copies,
      graveFee,
      casket,
      gravediggerCost,
      adminFees,
      totalDue,
      scheduledBy,
    } = body;

    if (!lastname) {
      return new NextResponse('Last name is required', { status: 401 });
    }
    if (!firstName) {
      return new NextResponse('First name is required', { status: 401 });
    }
    if (!idNumber) {
      return new NextResponse('ID Number is required', { status: 401 });
    }
    if (!address) {
      return new NextResponse('Address is required', { status: 401 });
    }
    if (!dateRemoved) {
      return new NextResponse('Removal Date is required', { status: 401 });
    }
    if (!byUndertaker) {
      return new NextResponse('Undertaker name is required', { status: 401 });
    }
    if (!doctorsFees) {
      return new NextResponse('Doctor fee is required', { status: 401 });
    }
    if (!storageFee) {
      return new NextResponse('Storage fee is required', { status: 401 });
    }
    if (!storageDays) {
      return new NextResponse('Amount of storage days is required', {
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
    if (!casket) {
      return new NextResponse('Casket is required', { status: 401 });
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
        lastname,
        firstName,
        idNumber,
        address,
        dateRemoved,
        byUndertaker,
        doctorsFees,
        storageFee,
        storageDays,
        copyFee,
        copies,
        graveFee,
        casket,
        gravediggerCost,
        adminFees,
        totalDue,
        scheduledBy,
      },
    });

    return NextResponse.json(bodyRemoval);
  } catch (error) {
    console.log('[REMOVAL_POST]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
