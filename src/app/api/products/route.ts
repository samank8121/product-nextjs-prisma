import prisma from '@/shared/data/prisma';
import { createProductSchema } from '@/shared/validation/product';
import { NextRequest } from 'next/server';
import { productIndex } from '@/shared/data/pinecone';
import { getEmbedding } from '@/shared/utils/openai';
import { getTranslationForNamespace, jsonResponse, errorResponse } from '@/shared/utils/api-utils';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const slug = searchParams.get('slug');
  const t = await getTranslationForNamespace(request, 'Error');
  
  try {    
    const products = slug
      ? await prisma.product.findFirst({ where: { slug } })
      : await prisma.product.findMany();

    return jsonResponse({ products });
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    return errorResponse(t('errorOccured'));
  }
}

export async function POST(request: NextRequest) {
  const te = await getTranslationForNamespace(request, 'Error');
  
  try {    
    const t = await getTranslationForNamespace(request, 'Validation');
    const body = await request.json();

    const parseResult = createProductSchema(t).safeParse(body);

    if (!parseResult.success) {
      return errorResponse(parseResult.error.toString(), 400);
    }

    const { caption, price, slug, weight, rate, description, imageSrc } = parseResult.data;

    const existingProduct = await prisma.product.findFirst({ where: { slug } });
    if (existingProduct) {
      return errorResponse(t('Product.duplicate'), 400);
    }

    const embedding = await getEmbeddingForProduct(caption, rate, description);
    const productResult = await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: { caption, price, slug, weight, rate, description, imageSrc },
      });

      await productIndex.namespace('product-ns').upsert([
        { id: product.slug, values: embedding },
      ]);

      return product;
    });

    return jsonResponse({ productResult }, 201);
  } catch (error) {
    console.error(error);
    return errorResponse(te('errorOccured'));
  }
}

export async function DELETE(request: NextRequest) {
  const te = await getTranslationForNamespace(request, 'Error');
 
  try {    
    const body = await request.json();
    const { slug } = body;

    const existingProduct = await prisma.product.findFirst({ where: { slug } });
    if (!existingProduct) {
      return errorResponse(te('itemNotExists'), 400);
    }

    const tp = await getTranslationForNamespace(request, 'Product');
    const productResult = await prisma.$transaction(async (tx) => {
      const product = await tx.product.delete({ where: { id: existingProduct.id } });

      await productIndex.namespace('product-ns').deleteOne(product.slug);

      return product;
    });

    return jsonResponse({ message: tp('deleted', { caption: productResult.caption }) });
  } catch (error) {
    console.error(error);
    return errorResponse(te('errorOccured'));
  }
}

async function getEmbeddingForProduct(caption: string, rate: number, description: string) {
  return getEmbedding(`caption:${caption}\n\nrate:${rate}\n\ndescription:${description}`);
}

