import { getRole } from '@/actions/getRole';
import { GetToken } from '@/actions/getToken';
import { User } from '@/types';
import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const token = await GetToken();

  try {
    const { data }: { data: any[] } = await axios.get(
      `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users`,
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json(data);
  } catch (error) {
    console.log('USERS_GET', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
