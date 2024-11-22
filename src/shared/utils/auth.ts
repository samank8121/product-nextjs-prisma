import * as jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

export interface AuthTokenPayload {
  userId: number;
}

export function auth(request: NextRequest): AuthTokenPayload | NextResponse {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader) {
    return NextResponse.json({ error: 'Authorization header missing' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return NextResponse.json({ error: 'Invalid token format' }, { status: 401 });
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
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}