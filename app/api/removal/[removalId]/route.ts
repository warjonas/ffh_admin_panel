import prismadb from '@/lib/prismadb';
import { getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { removalId: string } }
) {
  const session = await getSession();

  if (!session) {
    return new NextResponse('Unauthorized', { status: 500 });
  }
  if (!params.removalId) {
    return new NextResponse('Removal Id is required', { status: 401 });
  }

  try {
    const bodyRemoval = await prismadb.removal.findFirst({
      where: {
        id: params.removalId,
      },
      include: {
        receipts: true,
        deceased: true,
      },
    });

    return NextResponse.json(bodyRemoval);
  } catch (error) {
    console.log('[REMOVAL_GET_SINGLE]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { removalId: string } }
) {
  const session = await getSession();
  if (!session) {
    return new NextResponse('Unauthorized', { status: 500 });
  }

  if (!params.removalId) {
    return new NextResponse('Removal Id Is required', { status: 401 });
  }

  try {
    const bodyRemoval = await prismadb.removal.delete({
      where: {
        id: params.removalId,
      },
    });

    return NextResponse.json(bodyRemoval);
  } catch (error) {
    console.log('[REMOVAL_DELETE]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { removalId: string } }
) {
  const session = await getSession();
  if (!session) {
    return new NextResponse('Unauthorized', { status: 500 });
  }

  if (!params.removalId) {
    return new NextResponse('Removal Id is required', { status: 401 });
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
      dateRequested,
      gravediggerCost,
      adminFees,
      totalDue,
      scheduledBy,
      deathRegistration,
    } = body;

    if (!byUndertaker) {
      return new NextResponse('Undertaker name is required', {
        status: 401,
      });
    }
    if (!doctorsFees) {
      return new NextResponse('Doctor fee is required', { status: 401 });
    }
    if (!storageFee) {
      return new NextResponse('Storage fee is required', { status: 401 });
    }
    if (!storage) {
      return new NextResponse('Storage Fee is required', {
        status: 401,
      });
    }
    if (!copyFee) {
      return new NextResponse('Copy Fee is required', { status: 401 });
    }
    if (!copies) {
      return new NextResponse('Amount of Copies is required', {
        status: 401,
      });
    }
    if (!graveFee) {
      return new NextResponse('Grave fee is required', { status: 401 });
    }

    if (!gravediggerCost) {
      return new NextResponse('Gravedigger cost is required', {
        status: 401,
      });
    }
    if (!adminFees) {
      return new NextResponse('Admin fee is required', { status: 401 });
    }
    if (!dateRequested) {
      return new NextResponse('Date requested is required', { status: 401 });
    }
    if (!totalDue) {
      return new NextResponse('Total Due is required', { status: 401 });
    }
    if (!deathRegistration) {
      return new NextResponse('Death Registration fee is required', {
        status: 401,
      });
    }

    const bodyRemoval = await prismadb.removal.update({
      where: {
        id: params.removalId,
      },
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
        updatedBy: scheduledBy,
        deathRegistration,
        dateRequested,
      },
    });

    return NextResponse.json(bodyRemoval);
  } catch (error) {
    console.log('[REMOVAL_PATCH]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
