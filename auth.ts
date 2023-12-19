import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';

import authConfig from './auth.config';
import prismadb from './lib/prismadb';

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  adapter: PrismaAdapter(prismadb),
  session: { strategy: 'jwt' },
  ...authConfig,
});
