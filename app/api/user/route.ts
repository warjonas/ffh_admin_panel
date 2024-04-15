import { getRole } from '@/actions/getRole';
import { GetToken } from '@/actions/getToken';
import { User } from '@/types';
import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const {
    access_token,
    token_type,
  }: { access_token: string; token_type: string } = await GetToken();

  try {
    const { data }: { data: any[] } = await axios.get(
      `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users`,
      {
        headers: {
          Authorization: `${token_type} ${access_token}`,
        },
      }
    );

    return NextResponse.json(data);
  } catch (error) {
    console.log('USERS_GET', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
