import { generateId } from '@/actions/getInvoiceId';
import prismadb from '@/lib/prismadb';
import { getSession } from '@auth0/nextjs-auth0';

import { NextResponse } from 'next/server';

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
      totalPayable,
      amountPaid,
      notes,
      doctor,
      cremationDoctor,
      liveStreaming,
      coffinid,
      church,
      createdBy,
      afterHour,
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

    const receiptNo = await generateId();

    const arrangement = await prismadb.arrangement.create({
      data: {
        dateOfFuneralService,
        receiptNo,
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
        totalPayable,
        storageDays,
        notes,
        tombstoneId,
        afterHour,
        cremationDoctor,
        doctor,
        amountPaid,
        wreaths,

        coffinId: coffinid,
      },
    });

    return NextResponse.json(arrangement);
  } catch (error) {
    console.log('[ARRANGEMENT_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
