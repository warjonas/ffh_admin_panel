import prismadb from '@/lib/prismadb';
import { getSession } from '@auth0/nextjs-auth0';

import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const vehicles = await prismadb.vehicle.findMany({
      include: {
        logs: true,
      },
    });

    return NextResponse.json(vehicles);
  } catch (error) {
    console.log('VEHICLES_GET', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getSession();

  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const body = await req.json();

  const { addedOn, colour, registration, available } = body;

  try {
    const vehicle = await prismadb.vehicle.create({
      data: {
        addedOn,
        colour,
        registration,
      },
    });

    return NextResponse.json(vehicle);
  } catch (error) {
    console.log('VEHICLE_POST');
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
