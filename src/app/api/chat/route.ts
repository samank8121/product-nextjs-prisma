import prisma from '@/shared/data/prisma';
import { NextRequest } from 'next/server';
import { getEmbedding } from '@/shared/utils/openai';
import { productIndex } from '@/shared/data/pinecone';
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { getTranslations } from 'next-intl/server';
import { getLocale } from '@/shared/utils/getLocale';

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function POST(request: NextRequest) {
  const locale = getLocale(request.headers.get('accept-language'));
  const te = await getTranslations({ locale, namespace: 'Error' });
  const tchat = await getTranslations({ locale, namespace: 'Chat' });
  try {
    const body = await request.json();
    const messages: Message[] = body.messages;

    const messagesTruncated = messages.slice(-6);

    const embedding = await getEmbedding(
      messagesTruncated.map((message) => message.content).join('\n')
    );

    const vectorQueryResponse = await productIndex
      .namespace('product-ns')
      .query({
        vector: embedding,
        topK: 6,
      });

    const relevantProducts = await prisma.product.findMany({
      where: {
        slug: {
          in: vectorQueryResponse.matches.map((match) => match.id),
        },
      },
    });
    const systemMessage: Message = {
      role: 'system',
      content:
        tchat('productAssistant') +
        relevantProducts
          .map(
            (product) =>
              `Caption: ${product.caption}\n\nRate: ${product.rate}\n\nDescription: ${product.description}\n\nLink: ${getDomain(locale, product.slug)}`
          )
          .join('\n\n') +  tchat('productAssistantLinkSample'),
    };

    const result = await streamText({
      model: openai('gpt-3.5-turbo'),
      messages: [systemMessage, ...messagesTruncated],
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error(error);
    return Response.json({ error: te('errorOccured') }, { status: 500 });
  }
}
const getDomain = (locale: string, slug: string) => {
  return `${process.env.DOMAIN}${locale}/${slug}`;
};
