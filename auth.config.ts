import CredentialsProvider from 'next-auth/providers/credentials';

import type { NextAuthConfig } from 'next-auth';

export default {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'username', type: 'text', placeholder: 'jfortuin' },
        passwrod: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const user = { id: '1', name: 'J Smith', email: 'jsmith@example.com' };

        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  //   callbacks:{
  //     async jwt(token, user, account, profile, isNewUser) {
  //         if(user){
  //             token.id = user.id
  //         }
  //         return token
  //     }
  //   },
  secret: process.env.NEXTAUTH_SECRET,

  debug: process.env.NODE_ENV === 'development',
  pages: {
    signIn: '/login',
  },
} satisfies NextAuthConfig;
