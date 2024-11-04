import prisma from '@/shared/data/prisma';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const slug = searchParams.get('slug')

  try {
    const products =
      slug && slug !== ''
        ? await prisma.product.findFirst({ where: { slug: slug } })
        : await prisma.product.findMany();

    return new Response(JSON.stringify({ products }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.log(e);
    await prisma.$disconnect();
    console.log(e);
    return new Response(JSON.stringify({ error: 'An error occurred' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
