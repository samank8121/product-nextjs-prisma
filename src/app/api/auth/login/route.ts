import { NextRequest } from 'next/server';
import prisma from '@/shared/data/prisma';
import { jsonResponse, errorResponse } from '@/shared/utils/api-utils';
import * as jwt from 'jsonwebtoken';
import argon2 from 'argon2';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

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