import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Github from 'next-auth/providers/github';
import prisma from '@/shared/data/prisma';
import argon2 from 'argon2';

export default {
  providers: [
    Github({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Credentials({
      async authorize(credentials) { 
        if (!credentials || !credentials.username || !credentials.password)
          return null;
        const { username, password } = credentials;
        const user = await prisma.user.findFirst({
          where: { email: username },
        });
        if (!user) {
          return { error: 'User not found' };
        }
        if (user.password) {
          const isValid = await argon2.verify(
            user.password,
            password as string
          );
          if (!isValid) {
            return { error: 'Invalid password' };
          }
        }
        console.log('Credentials get user', user);
        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
} satisfies NextAuthConfig;
