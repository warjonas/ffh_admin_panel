import { calculate_days } from '@/actions/getUpcomingRemovals';
import prismadb from '@/lib/prismadb';
import { getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const session = await getSession();

  if (!session) {
    return new NextResponse('Unauthorized', { status: 500 });
  }

  try {
    const removals = await prismadb.removal.findMany({
      include: {
        receipts: true,
        deceased: true,
      },
    });
    const upcomingRemovals = removals.filter(async (removal) => {
      let d = new Date();
      // d.setDate(d.getDate() + 7);

      let days = await calculate_days(d, removal.dateRequested);

      if (days < 7) {
        return removal;
      }
    });

    // console.log(upcomingRemovals);

    return NextResponse.json(upcomingRemovals);
  } catch (error) {
    console.log('[REMOVAL_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
