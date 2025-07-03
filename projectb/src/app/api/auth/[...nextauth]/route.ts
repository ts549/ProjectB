import NextAuth from 'next-auth/next';
import GoogleProvider from 'next-auth/providers/google';
import type { NextAuthOptions } from 'next-auth';

const handler = NextAuth({
  providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
    ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
        token.id = profile?.name;
      }
      return token;
    },
    async session({ session, token, user }) {
      // you can add user id or other data here
      const newSession = {
        ...session,
        accessToken: token.accessToken,
        user: {
          ...user,
          id: token.id,
        }
      };

      return newSession;
    },
  },
});

export { handler as GET, handler as POST }