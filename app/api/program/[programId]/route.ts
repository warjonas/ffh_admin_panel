import prismadb from '@/lib/prismadb';
import { getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { programId: string } }
) {
  const session = await getSession();

  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  if (!params.programId) {
    return new NextResponse('Program Id is required', { status: 400 });
  }

  try {
    const program = await prismadb.funeralProgram.findFirst({
      where: {
        id: params.programId,
      },
    });

    return NextResponse.json(program);
  } catch (error) {
    console.log('FUNERAL_PROGRAM_POST', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { programId: string } }
) {
  const session = await getSession();

  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      languageOfProgram,
      atChurch,
      atHome,
      hymn,
      nickName,
      otherInformation,
      firstNameOfDeceased,
      lastNameOfDeceased,
      orbituaryText,
      pallbearersGrave,
      pallbearersInChurch,
      pallbearersInHouse,
      pallbearersOutChurch,
      pallbearersOutHouse,
      survivedBy,
      createdBy,
      needPallbearers,
      dateOfBirth,
      dateOfDeath,
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

    if (!firstNameOfDeceased) {
      return new NextResponse('First name is required', { status: 400 });
    }

    if (!lastNameOfDeceased) {
      return new NextResponse('Last name is required', { status: 400 });
    }

    if (!pallbearersGrave) {
      return new NextResponse('Pallbearers required for grave site', {
        status: 400,
      });
    }

    if (!pallbearersInChurch) {
      return new NextResponse('Pallbearers required for into church', {
        status: 400,
      });
    }

    if (!pallbearersOutChurch) {
      return new NextResponse('Pallbearers required for out of church', {
        status: 400,
      });
    }

    if (!pallbearersInHouse) {
      return new NextResponse('Pallbearers required for into home', {
        status: 400,
      });
    }

    if (!pallbearersOutHouse) {
      return new NextResponse('Pallbearers required for out of home', {
        status: 400,
      });
    }

    const funeralProgram = await prismadb.funeralProgram.update({
      where: {
        id: params.programId,
      },
      data: {
        updatedBy: createdBy,
        languageOfProgram,
        lastNameOfDeceased,
        firstNameOfDeceased,
        nickName,
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
        needPallbearers,
        dateOfBirth: new Date(dateOfBirth),
        dateOfDeath: new Date(dateOfDeath),
        createdBy,
        survivedBy,
        orbituaryText,
        hymn,
      },
    });

    return NextResponse.json(funeralProgram);
  } catch (error) {
    console.log('FUNERAL_PROGRAM_PATCH', error);

    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { programId: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const funeralProgram = await prismadb.funeralProgram.deleteMany({
      where: {
        id: params.programId,
      },
    });

    return NextResponse.json(funeralProgram);
  } catch (error) {
    console.log('Internal Server Error', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
