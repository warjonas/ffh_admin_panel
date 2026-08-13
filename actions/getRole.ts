'use server';

import axios from 'axios';
import { GetToken } from './getToken';

export const getRole = async (email: string) => {
  const {
    access_token,
    token_type,
  }: { access_token: string; token_type: string } = await GetToken();

  const { data: user }: { data: any[] } = await axios.get(
    `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users-by-email`,
    {
      params: {
        email,
      },
      headers: {
        Authorization: `${token_type} ${access_token}`,
      },
    },
  );

  const { data }: { data: any[] } = await axios.get(
    `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users/${user[0].user_id}/roles`,
    {
      headers: {
        Authorization: `${token_type} ${access_token}`,
      },
    },
  );

  const role = data[0].name;

  return role;
};
