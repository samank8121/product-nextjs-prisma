import prisma from '@/shared/data/prisma';
import { createProductSchema } from '@/shared/validation/product';
import { NextRequest } from 'next/server';
import { getTranslations } from 'next-intl/server';
import { getEmbedding } from '@/shared/utils/openai';
import { productIndex } from '@/shared/data/pinecone';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const slug = searchParams.get('slug');

  try {
    const products =
      slug && slug !== ''
        ? await prisma.product.findFirst({ where: { slug: slug } })
        : await prisma.product.findMany();

    return Response.json({ products }, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
    return Response.json({ error: 'An error occurred' }, {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
export async function POST(request: NextRequest) {
  try {
    const locale = request.headers.get('accept-language') || 'en';
    const t = await getTranslations({locale, namespace: 'Validation'});
    const body = await request.json();

    const parseResult = createProductSchema(t).safeParse(body);
    
    if (!parseResult.success) {
      return Response.json({ error: parseResult.error }, { status: 400 });
    }
    
    const { caption, price, slug, weight, rate, description, imageSrc } =
      parseResult.data;

    const product =  await prisma.product.findFirst({ where: { slug: slug } })
    if(product)
    {
      return Response.json({ error: t('Product.duplicate') }, { status: 400 });
    }
    const embedding = await getEmbeddingForProduct(caption, rate, description);
    const productResult = await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          caption,
          price,
          slug,
          weight,
          rate,
          description,
          imageSrc,
        },
      });

      await productIndex.namespace("product-ns").upsert([
        {
          id: product.slug,
          values: embedding,
        },
      ]);

      return product;
    });

    return Response.json({ productResult }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
async function getEmbeddingForProduct(caption: string, rate: number, description: string) {
  return getEmbedding(`caption:${caption} \n\n rate:${rate} \n\n description:${description} `);
}
