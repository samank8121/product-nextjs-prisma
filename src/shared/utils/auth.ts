import * as jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { errorResponse, getTranslationForNamespace } from './api-utils';

export interface AuthTokenPayload {
  userId: string;
}

export async function auth(request: NextRequest): Promise<AuthTokenPayload | NextResponse> {
  const authHeader = request.headers.get('Authorization');
  const te = await getTranslationForNamespace(request, 'Error');
  if (!authHeader) {
    return errorResponse(te('authMissing'), 401);
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return errorResponse(te('authInvalid'), 401);
  }

  try {
    const secretKey = process.env.TOKEN_SECRET_KEY;
    if (!secretKey) {
      throw new Error(te('authTokenNotSet'));
    }

    const payload = jwt.verify(token, secretKey) as AuthTokenPayload;
    return payload;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return errorResponse(te('authInvalid'), 401);
    }
    return errorResponse(te('internalError'));
  }
}