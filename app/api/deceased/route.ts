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
      dateOfDeath,
      removalDate,
      lastName,
      firstNames,
      idNumber,
      dateOfBirth,
      removalFrom,
      ffhMemberNo,
      deathCertificateRecipient,
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
    if (!removalDate) {
      return new NextResponse('Removal Date is required', {
        status: 400,
      });
    }

    const deceased = await prismadb.deceased.create({
      data: {
        lastName,
        firstNames,
        idNumber,
        dateOfBirth: new Date(dateOfBirth),
        removalFrom,
        ffhMemberNo,
        deathCertificateRecipient,
        dateOfDeath: new Date(dateOfDeath),
        removalDate: new Date(removalDate),
      },
    });

    return NextResponse.json(deceased);
  } catch (error) {
    console.log('[DECEASED_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
