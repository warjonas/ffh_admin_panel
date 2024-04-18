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
        deceased: {
          flagDelete: false,
        },
      },
      include: {
        deceased: true,
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
  try {
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
      needPallbearers,
    } = body;

    if (!languageOfProgram) {
      return new NextResponse('Language of program is required', {
        status: 400,
      });
    }

    if (!deceasedId) {
      return new NextResponse('Deceased ID is required', { status: 400 });
    }

    const funeralProgram = await prismadb.funeralProgram.update({
      where: {
        id: params.programId,
      },
      data: {
        updatedBy: createdBy,
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
        needPallbearers,
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
    console.log('FUNERAL_PROGRAM_DELETE', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
