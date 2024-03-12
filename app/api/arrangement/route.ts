import { generateId } from '@/actions/getInvoiceId';
import prismadb from '@/lib/prismadb';
import { getSession } from '@auth0/nextjs-auth0';

import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const arrangement = await prismadb.arrangement.findMany({
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
      cemetry,
      doves,
      programs,
      bus,
      car,
      digger,
      wreaths,
      storageDays,
      decor,
      tombstoneId,
      totalDue,
      outstandingBalance,
      notes,
      doctor,
      cremationDoctor,
      liveStreaming,
      coffinid,
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

    const invoiceNo = await generateId('INV');

    const arrangement = await prismadb.arrangement.create({
      data: {
        dateOfFuneralService,
        invoiceNo,
        createdBy: createdBy ? createdBy : user,
        deceasedId: deceased,
        familyReps,
        deliveryAddress,
        deliveryTime,
        church,
        cemetry,
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
        storageDays,
        notes,
        tombstoneId,
        afterHour,
        cremationDoctor,
        doctor,
        outstandingBalance,
        wreaths,
        paidUp: false,

        coffinId: coffinid,
      },
    });

    return NextResponse.json(arrangement);
  } catch (error) {
    console.log('[ARRANGEMENT_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
