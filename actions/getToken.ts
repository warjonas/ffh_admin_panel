import axios from 'axios';

export const GetToken = async () => {
  const { data }: { data: { access_token: string; token_type: string } } =
    await axios.post(
      `${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`,
      {
        client_id: `${process.env.AUTH0_CLIENT_ID}`,
        client_secret: `${process.env.AUTH0_CLIENT_SECRET}`,
        audience: `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/`,
        grant_type: 'client_credentials',
      },
      {
        headers: {
          'content-type': 'application/json',
        },
      }
    );

  return data.access_token;
};
