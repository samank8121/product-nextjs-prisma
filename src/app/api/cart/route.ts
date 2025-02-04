import prisma from '@/shared/data/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/shared/utils/auth';
import {
  errorResponse,
  getTranslationForNamespace,
  jsonResponse,
} from '@/shared/utils/api-utils';
import { CartType } from '@/types/cart-type';

export async function GET(request: NextRequest) {
  const te = await getTranslationForNamespace(request, 'Error');
  const authResult = await auth(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { userId } = authResult;
  if (!userId) {
    return errorResponse(te('login'), 401);
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
  const cart: CartType = {
    products: {},
    totalCount: 0,
  };
  if (response) {
    response.cart_product.forEach((item) => {
      cart.products[item.productId] = item.productCount;
      cart.totalCount += item.productCount;
    });
  }
  return jsonResponse(cart);
}
export async function POST(request: NextRequest) {
  const te = await getTranslationForNamespace(request, 'Error');
  try {
    const authResult = await auth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { userId } = authResult;

    if (!userId) {
      return errorResponse(te('login'), 401);
    }

    const { productId, count } = await request.json();
    const result = await prisma.$transaction(async (tx) => {
      const cart = await getOrCreateCart(tx, userId);
      const product = await getProduct(tx, productId);
      if (!product) {
        throw new Error(te('productNotFound'));
      }

      await updateCartProduct(tx, cart.id, productId, count);

      return await getUpdatedCart(tx, cart.id);
    });

    return jsonResponse(result);
  } catch (error) {
    console.error('Error changing product in cart:', error);
    return errorResponse(
      te('cartChange')
    );
  }
}

async function getOrCreateCart(tx: any, userId: string) {
  let cart = await tx.cart.findFirst({
    where: { userId },
    include: { cart_product: true },
  });
  if (!cart) {
    cart = await tx.cart.create({
      data: { userId },
    });
  }

  return cart;
}

async function getProduct(tx: any, productId: number) {
  return await tx.product.findUnique({
    where: { id: productId },
  });
}

async function updateCartProduct(
  tx: any,
  cartId: string,
  productId: number,
  count: number
) {
  if (count === 0) {
    await tx.cart_product.deleteMany({
      where: {
        cartId,
        productId,
      },
    });
  } else {
    await tx.cart_product.upsert({
      where: {
        cartId_productId: {
          cartId,
          productId,
        },
      },
      update: {
        productCount: count,
      },
      create: {
        cartId,
        productId,
        productCount: count,
      },
    });
  }
}

async function getUpdatedCart(tx: any, cartId: string) {
  return await tx.cart.findUnique({
    where: { id: cartId },
    include: {
      cart_product: {
        include: {
          product: true,
        },
      },
    },
  });
}
