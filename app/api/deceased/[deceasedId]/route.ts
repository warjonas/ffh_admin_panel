import { generateId } from '@/actions/getInvoiceId';
import prismadb from '@/lib/prismadb';
import { getSession } from '@auth0/nextjs-auth0';
import { FamilyRep } from '@prisma/client';
import { ObjectId } from 'bson';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { deceasedId: string } }
) {
  let deceased;

  if (params.deceasedId === null) {
    return new NextResponse('No deceased Id', { status: 500 });
  }

  try {
    deceased = await prismadb.deceased.findFirst({
      where: {
        id: params.deceasedId,
      },
      include: {
        arrangement: {
          include: {
            tombstone: true,
            coffin: true,
            grave: true,
            receipts: true,
          },
        },
        funeralProgram: true,
      },
    });

    return NextResponse.json(deceased);
  } catch (error) {
    console.log('DECEASED_SINGLE_GET', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { deceasedId: string } }
) {
  try {
    const session = await getSession();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();

    const {
      dateOfDeath,
      removalDate,
      lastName,
      firstNames,
      idNumber,
      dateOfBirth,
      removalFrom,
      removalTime,
      ffhMemberNo,
      deathCertificateRecipient,
      updatedBy,
    } = body;

    if (!dateOfBirth) {
      return new NextResponse('Date of Birth is required', {
        status: 400,
      });
    }
    if (!dateOfDeath) {
      return new NextResponse('Date of Death is required', {
        status: 400,
      });
    }
    if (!lastName) {
      return new NextResponse('Last Name is required', {
        status: 400,
      });
    }
    if (!firstNames) {
      return new NextResponse('First Name is required', {
        status: 400,
      });
    }
    if (!idNumber) {
      return new NextResponse('Id Number is required', {
        status: 400,
      });
    }
    if (!removalFrom) {
      return new NextResponse('Removal Address is required', {
        status: 400,
      });
    }

    if (!removalTime) {
      return new NextResponse('Removal Time is required', {
        status: 400,
      });
    }
    if (!removalDate) {
      return new NextResponse('Removal Date is required', {
        status: 400,
      });
    }

    const deceased = await prismadb.deceased.update({
      where: {
        id: params.deceasedId,
      },
      data: {
        lastName,
        firstNames,
        idNumber,
        dateOfBirth: new Date(dateOfBirth),
        removalFrom,
        removalTime,
        ffhMemberNo,
        deathCertificateRecipient,
        dateOfDeath: new Date(dateOfDeath),
        removalDate: new Date(removalDate),
        updatedBy,
      },
    });

    return NextResponse.json(deceased);
  } catch (error) {
    console.log('DECEASED_PATCH', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { deceasedId: string } }
) {
  try {
    const session = getSession();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const deceased = await prismadb.deceased.update({
      where: {
        id: params.deceasedId,
      },
      data: {
        flagDelete: true,
      },
    });

    return NextResponse.json(deceased);
  } catch (error) {
    console.log('DECEASED_DELETE', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
