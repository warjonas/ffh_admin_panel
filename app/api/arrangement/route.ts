import { generateId } from '@/actions/getInvoiceId';
import prismadb from '@/lib/prismadb';
import { getSession } from '@auth0/nextjs-auth0';
import { FamilyRep } from '@prisma/client';
import { ObjectId } from 'bson';
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
      deceasedId,
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

    if (!familyReps) {
      return new NextResponse('Atleast 1 family representative is required', {
        status: 400,
      });
    }

    if (!deceasedId) {
      return new NextResponse('Deceased ID is required', {
        status: 400,
      });
    }

    if (!deliveryAddress) {
      return new NextResponse('Delivery Address is required', {
        status: 400,
      });
    }

    if (!deliveryTime) {
      return new NextResponse('Delivery Time is required', {
        status: 400,
      });
    }

    if (!minister) {
      return new NextResponse('Minister details is required', {
        status: 400,
      });
    }

    if (!crossSize) {
      return new NextResponse('Cross Size is required', {
        status: 400,
      });
    }

    if (!cemetry) {
      return new NextResponse('cemetry is required', {
        status: 400,
      });
    }

    if (!programs) {
      return new NextResponse('Program amount is required', {
        status: 400,
      });
    }

    if (!storageDays) {
      return new NextResponse('Storage days  is required', {
        status: 400,
      });
    }

    if (!decor) {
      return new NextResponse('Decor details  is required', {
        status: 400,
      });
    }

    if (!tombstoneId) {
      return new NextResponse('Tombstone is required', {
        status: 400,
      });
    }

    if (!totalPayable) {
      return new NextResponse('Total payable is required', {
        status: 400,
      });
    }

    if (!amountPaid) {
      return new NextResponse('Amount  be paid is required', {
        status: 400,
      });
    }

    if (!notes) {
      return new NextResponse('Notes is required', {
        status: 400,
      });
    }

    if (!coffinid) {
      return new NextResponse('Coffin is required', {
        status: 400,
      });
    }

    const receipt = await generateId();

    const arrangement = await prismadb.arrangement.create({
      data: {
        dateOfFuneralService,
        receiptNo: receipt,
        createdBy,
        deceasedId,
        familyReps,
        deliveryAddress,
        deliveryTime: deliveryTime,
        church,
        cemetry,
        minister,
        digger: true,
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

        coffinId: coffinid,
      },
    });

    return NextResponse.json(arrangement);
  } catch (error) {
    console.log('[ARRANGEMENT_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
