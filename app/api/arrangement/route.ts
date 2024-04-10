import { generateId } from '@/actions/getInvoiceId';
import prismadb from '@/lib/prismadb';
import { getSession } from '@auth0/nextjs-auth0';

import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const arrangement = await prismadb.arrangement.findMany({
      where: {
        deceased: {
          flagDelete: false,
        },
      },
      include: { deceased: true },
    });

    return NextResponse.json(arrangement);
  } catch (error) {
    console.log('ARRANGEMENTS_GET', error);
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
      familyReps,
      deceased,
      deliveryAddress,
      deliveryTime,
      dateOfFuneralService,
      minister,
      crossSize,
      graveId,
      graveTime,
      cemetry,
      doves,
      programs,
      bus,
      car,
      digger,
      wreaths,
      storage,
      decor,
      tombstoneId,
      totalDue,
      outstandingBalance,
      notes,
      doctor,
      cremationDoctor,
      liveStreaming,
      coffinId,
      church,
      createdBy,
      afterHour,
      paidUp,
    } = body;

    let user;

    if (!createdBy) {
      user = session.user;
    }

    if (!deceased) {
      return new NextResponse('Deceased ID is required', {
        status: 400,
      });
    }

    const deceasedData = await prismadb.deceased.findFirst({
      where: {
        id: deceased,
      },
    });

    if (!deceasedData) {
      return new NextResponse('Internal Error', { status: 500 });
    }

    const invoiceNo = await generateId('INV');

    const arrangement = await prismadb.arrangement.create({
      data: {
        dateOfFuneralService,
        invoiceNo,
        createdBy: createdBy ? createdBy : user,
        deceased: {
          connect: {
            id: deceased,
          },
        },
        familyReps,
        deliveryAddress,
        deliveryTime,
        church,
        grave: {
          connect: {
            id: graveId,
          },
        },
        graveTime,
        minister,
        digger,
        crossSize,
        doves,
        liveStreaming,
        programs,
        bus,
        familyCar: car,
        decor,
        totalDue,
        storage,
        notes,
        tombstone: {
          connect: {
            id: tombstoneId,
          },
        },
        afterHour,
        cremationDoctor,
        doctor,
        outstandingBalance,
        wreaths,
        paidUp: false,

        coffin: {
          connect: {
            id: coffinId,
          },
        },
      },
    });

    return NextResponse.json(arrangement);
  } catch (error) {
    console.log('[ARRANGEMENT_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
