import { NextRequest } from 'next/server';
import prisma from '@/shared/data/prisma';
import {
  jsonResponse,
  errorResponse,
  getTranslationForNamespace,
} from '@/shared/utils/api-utils';
import * as jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import { registerSchema } from '@/shared/validation/auth';

export async function POST(request: NextRequest) {
  const t = await getTranslationForNamespace(request, 'Validation');
  try {
    const body = await request.json();
    const parseResult = registerSchema(t).safeParse(body);

    if (!parseResult.success) {
      return errorResponse(parseResult.error.flatten(), 400);
    }
    const { username, email, password } = parseResult.data;
    const duplicateUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });
    if (duplicateUser) {
      return errorResponse(t('Auth.duplicateUser'), 409);
    }
    const hashedPassword = await argon2.hash(password);

    const user = await prisma.user.create({
      data: { username: username, password: hashedPassword, email },
    });
    const token = jwt.sign(
      { userId: user.id },
      process.env.TOKEN_SECRET_KEY as jwt.Secret
    );
    return jsonResponse({
      token,
      user: {
        username: user.username,
        email: user.email,
      },
    });
  } catch {
    return errorResponse(t('Auth.general'));
  }
}
