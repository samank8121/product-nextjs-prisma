import { NextRequest } from 'next/server';
import prisma from '@/shared/data/prisma';
import { jsonResponse, errorResponse, getTranslationForNamespace } from '@/shared/utils/api-utils';
import * as jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import { loginSchema } from '@/shared/validation/auth';

export async function POST(request: NextRequest) {
  try {
    const t = await getTranslationForNamespace(request, 'Validation');
    const body = await request.json();
    const parseResult = loginSchema(t).safeParse(body);
    
    if (!parseResult.success) {
      console.log('Login validation error:', parseResult.error.message);
      return errorResponse(parseResult.error.flatten(), 400);
    }
    const { username, password } = parseResult.data;
    const user = await prisma.user.findFirst({ where: { username } });
    if (!user) {
      return errorResponse('User not found', 404);
    }
    const isValid = await argon2.verify(user.password, password);
    if (!isValid) {
      return errorResponse('Invalid password', 401);
    }    
    const token = jwt.sign({ userId: user.id }, process.env.TOKEN_SECRET_KEY as jwt.Secret);

    return jsonResponse({
      token,
      user: {
        username: user.username,
        email: user.email,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse('An error occurred during login');
  }
}