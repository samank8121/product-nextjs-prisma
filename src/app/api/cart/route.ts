import prisma from '@/shared/data/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/shared/utils/auth';

export async function GET(request: NextRequest) {
  const authResult = auth(request);

  if (authResult instanceof NextResponse) {
    return authResult;
  }
  const { userId } = authResult;
    if (!userId) {
      return NextResponse.json({ error: 'Please log in' }, { status: 401 });
    }

    const response = await prisma.cart.findFirst({
      where: { userId },
      include: {
        cart_product: {
          include: {
            product: true,
          },
        },
      },
    });

    NextResponse.json(response);  
}

