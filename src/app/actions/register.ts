'use server'

import prisma from '@/shared/data/prisma';
import { RegisterSchema, registerSchema } from '@/shared/validation/auth';
import argon2 from 'argon2';
import { getTranslations } from 'next-intl/server';

type RegisterResponse = {
  userId?: string, email?:string, error?:string
}
export const register = async (values: RegisterSchema): Promise<RegisterResponse> => {
  const t = await getTranslations({ locale: 'en', namespace: 'Validation' });
  const validatedFields = registerSchema(t).safeParse(values);

  if (!validatedFields.success) {
    return { error: JSON.stringify(validatedFields.error) };
  }
  const { username, email, password } = validatedFields.data;
  // Check for duplicate user
  const duplicateUser = await prisma.user.findFirst({
    where: { email },
  });
  if (duplicateUser) {
    return { error: 'Duplicate user' };
  }

  const hashedPassword = await argon2.hash(password);
  //   let user;
  //   let token;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { name: username, password: hashedPassword, email },
      });
      // token = jwt.sign(
      //   { userId: user.id },
      //   process.env.TOKEN_SECRET_KEY as jwt.Secret
      // );
      return { userId: user.id, email };
    });
    return result;
  } catch (error) {
    console.error(error);
    return { error: 'Registration failed' };
  }

  //   return {
  //     user,
  //     token,
  //   };
};
