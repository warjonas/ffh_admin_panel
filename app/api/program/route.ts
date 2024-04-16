import prismadb from '@/lib/prismadb';
import { getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

export async function POST(req: Request, params: { approved: boolean }) {
  try {
    // const headers = await req.headers.get('type');

    const body = await req.json();

    const {
      languageOfProgram,
      atChurch,
      atHome,
      hymn,
      deceasedId,
      otherInformation,
      orbituaryText,
      pallbearersGrave,
      pallbearersInChurch,
      pallbearersInHouse,
      pallbearersOutChurch,
      pallbearersOutHouse,
      survivedBy,
      createdBy,
    } = body;

    if (!languageOfProgram) {
      return new NextResponse('Language of program is required', {
        status: 400,
      });
    }

    if (!atChurch) {
      return new NextResponse('Officiating minister at church is required', {
        status: 400,
      });
    }

    if (!atHome) {
      return new NextResponse('Missing information for at home service', {
        status: 400,
      });
    }

    if (!hymn) {
      return new NextResponse('Hymns are required', { status: 400 });
    }

    if (!deceasedId) {
      return new NextResponse('Deceased Id is required', { status: 400 });
    }

    const checkDeceased = await prismadb.deceased.findFirst({
      where: {
        id: deceasedId,
      },
    });

    if (!checkDeceased) {
      return new NextResponse('Incorrect Deceased details', {
        status: 400,
      });
    }

    const funeralProgram = await prismadb.funeralProgram.create({
      data: {
        languageOfProgram,
        atChurch: {
          ...atChurch,
          officiatingMinister: atChurch.officiatingMinister,
        },
        atHome,
        pallbearersGrave,
        pallbearersInChurch,
        pallbearersOutChurch,
        pallbearersInHouse,
        pallbearersOutHouse,
        otherInformation,

        createdBy,
        survivedBy,
        orbituaryText,
        hymn,
        deceasedId,
      },
    });

    return NextResponse.json(funeralProgram);
  } catch (error) {
    console.log('FUNERAL_PROGRAM_POST', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
