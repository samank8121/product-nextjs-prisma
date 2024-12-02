import prisma from '@/shared/data/prisma';
import * as jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import { loginSchema, LoginSchema } from '@/shared/validation/auth';
import { getTranslations } from 'next-intl/server';

export const login = async (values: LoginSchema) => {
  try {
    const t = await getTranslations({ locale: 'en', namespace: 'Validation' });
    const validatedFields = loginSchema(t).safeParse(values);
    if (!validatedFields.success) {
      return { error: 'User not found' };
    }
    const { username, password } = validatedFields.data;
    const user = await prisma.user.findFirst({ where: { email: username } });
    if (!user) {
      return { error: 'User not found' };
    }
    if (user.password) {
      const isValid = await argon2.verify(user.password, password);
      if (!isValid) {
        return { error: 'Invalid password' };
      }
    }
    const token = jwt.sign(
      { userId: user.id },
      process.env.TOKEN_SECRET_KEY as jwt.Secret
    );

    return {
      token,
      user: {
        id: user.id,
        username: user.name,
        email: user.email,
      },
    };
  } catch (error) {
    console.error('Login error:', error);
    return { error: 'An error occurred during login' };
  }
};
