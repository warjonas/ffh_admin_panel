import { generateId } from '@/actions/getInvoiceId';
import prismadb from '@/lib/prismadb';
import { getSession } from '@auth0/nextjs-auth0';
import { FamilyRep } from '@prisma/client';
import { ObjectId } from 'bson';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { arrangementId: string } }
) {
  const session = getSession();
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const arrangement = await prismadb.arrangement.findFirst({
      where: {
        id: params.arrangementId,
      },
      include: {
        coffin: true,
        tombstone: true,
        deceased: true,
        receipts: true,
      },
    });

    return NextResponse.json(arrangement);
  } catch (error) {
    console.log('ARRANGEMENT_SINGLE_GET', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { arrangementId: string } }
) {
  const session = await getSession();
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  try {
    const body = await req.json();

    const {
      familyReps,
      deceased,
      deliveryAddress,
      deliveryTime,
      minister,
      crossSize,
      cemetry,
      doves,
      programs,
      bus,
      car,
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
      coffinid,
      church,
      digger,
      updatedBy,

      afterHour,
    } = body;

    const arrangement = await prismadb.arrangement.update({
      where: {
        id: params.arrangementId,
      },
      data: {
        deceasedId: deceased,
        familyReps,
        deliveryAddress,
        deliveryTime: deliveryTime,
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
        storage,
        notes,
        afterHour,
        cremationDoctor,
        doctor,
        outstandingBalance,
        tombstoneId,
        coffinId: coffinid,
        updatedBy,
      },
    });

    return NextResponse.json(arrangement);
  } catch (error) {
    console.log('ARRANGEMENT_PATCH', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { arrangementId: string } }
) {
  try {
    const session = getSession();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const arrangement = await prismadb.arrangement.deleteMany({
      where: {
        id: params.arrangementId,
      },
    });

    return NextResponse.json(arrangement);
  } catch (error) {
    console.log('ARRANGEMENT_DELETE', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
