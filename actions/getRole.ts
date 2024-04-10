'use server';

import axios from 'axios';

export const getRole = async (email: string) => {
  const { data: user }: { data: any[] } = await axios.get(
    `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users-by-email`,
    {
      params: {
        email,
      },
      headers: {
        Authorization: process.env.AUTH0_TOKEN,
      },
    }
  );

  const { data }: { data: any[] } = await axios.get(
    `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users/${user[0].user_id}/roles`,
    {
      headers: {
        Authorization: process.env.AUTH0_TOKEN,
      },
    }
  );

  const role = data[0].name;

  return role;
};
