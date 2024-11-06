import prisma from '@/shared/data/prisma';
import { NextRequest } from 'next/server';
import { getEmbedding } from '@/shared/utils/openai';
import { productIndex } from '@/shared/data/pinecone';
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function POST(requeset: NextRequest) {
  try {
    const body = await requeset.json();
    const messages: Message[] = body.messages;

    const messagesTruncated = messages.slice(-6);

    const embedding = await getEmbedding(
      messagesTruncated.map((message) => message.content).join('\n')
    );

    const vectorQueryResponse = await productIndex.query({
      vector: embedding,
      topK: 6,
    });

    const relevanProducts = await prisma.product.findMany({
      where: {
        slug: {
          in: vectorQueryResponse.matches.map((match) => match.id),
        },
      },
    });

    const systemMessage: Message = {
      role: 'system',
      content:
        "You are an intelligent e-commerce app. You answer the user's question based on their existing products. " +
        'The relevant product for this query are:\n' +
        relevanProducts
          .map(
            (product) =>
              `Caption: ${product.caption}\n\nRate: ${product.rate}\n\nDescription: ${product.description}\n`
          )
          .join('\n\n'),
    };

    const result = await streamText({
      model: openai('gpt-3.5-turbo'),
      messages:[systemMessage, ...messagesTruncated],
    });

  return result.toDataStreamResponse();
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
