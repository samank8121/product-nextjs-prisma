import prisma from '@/shared/data/prisma';
import { NextRequest } from 'next/server';
import { getEmbedding } from '@/shared/utils/openai';
import { productIndex } from '@/shared/data/pinecone';
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { 
  getTranslationForNamespace, 
  errorResponse,
  getLocaleFromRequest,
  getDomain
} from '@/shared/utils/api-utils';

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function POST(request: NextRequest) {
  const locale = getLocaleFromRequest(request);
  const te = await getTranslationForNamespace(request, 'Error');
  const tchat = await getTranslationForNamespace(request, 'Chat');

  try {
    const { messages }: { messages: Message[] } = await request.json();
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
          .join('\n\n') + tchat('productAssistantLinkSample'),
    };

    const result = await streamText({
      model: openai('gpt-3.5-turbo'),
      messages: [systemMessage, ...messagesTruncated],
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error(error);
    return errorResponse(te('errorOccured'));
  }
}

