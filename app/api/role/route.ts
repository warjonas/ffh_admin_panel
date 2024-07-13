import { getRole } from '@/actions/getRole';
import { GetToken } from '@/actions/getToken';
import { User } from '@/types';
import { getSession } from '@auth0/nextjs-auth0';
import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const token = await GetToken();
  const session = await getSession();

  try {
    const { data: user }: { data: any[] } = await axios.get(
      `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users-by-email`,
      {
        params: {
          email: session?.user.email,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const { data }: { data: any[] } = await axios.get(
      `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users/${user[0].user_id}/roles`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const role = data[0].name;

    return NextResponse.json(role);
  } catch (error) {
    console.log('ROLE_GET', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
