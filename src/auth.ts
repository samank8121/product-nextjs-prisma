import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import authConfig from '@/auth.config';

const prisma = new PrismaClient();

export const { auth, handlers, signIn, signOut } = NextAuth({
  // pages:{
  //   signIn:"/login",
  //   error:"/error"
  // }
  // callbacks: {
  //   async jwt({ token }) {
  //     console.log('jwt token', token);

  //     return token;
  //   },
  //   async session({ session, token }) {
  //     if (session.user && token.sub) {
  //       session.user.id = token.sub;
  //     }
  //     return session;
  //   },
  // },
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  ...authConfig,
});
