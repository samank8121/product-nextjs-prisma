import * as jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { errorResponse } from './api-utils';

export interface AuthTokenPayload {
  userId: string;
}

export function auth(request: NextRequest): AuthTokenPayload | NextResponse {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader) {
    return errorResponse('Authorization header missing', 401);
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return errorResponse('Invalid token format', 401);
  }

  try {
    const secretKey = process.env.TOKEN_SECRET_KEY;
    if (!secretKey) {
      throw new Error('TOKEN_SECRET_KEY is not set');
    }

    const payload = jwt.verify(token, secretKey) as AuthTokenPayload;
    return payload;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return errorResponse('Invalid token', 401);
    }
    return errorResponse('Internal server error');
  }
}