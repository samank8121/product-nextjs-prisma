import prisma from '@/shared/data/prisma';
import { NextRequest } from 'next/server';
import { getEmbedding } from '@/shared/utils/openai';
import { pineconeStore } from '@/shared/data/pinecone';
import {
  getTranslationForNamespace,
  errorResponse,
  getLocaleFromRequest,
  getDomain,
} from '@/shared/utils/api-utils';
import { ChatOpenAI } from '@langchain/openai';
import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from '@langchain/core/messages';
import { LangChainAdapter } from 'ai';

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}
const chatModel = new ChatOpenAI({
  modelName: 'gpt-3.5-turbo',
  streaming: true,
});

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

    const vectorQueryResponse =
      await pineconeStore.similaritySearchVectorWithScore(embedding, 2);
    const relevantProducts = await prisma.product.findMany({
      where: {
        slug: {
          in: vectorQueryResponse.map(([match]) => match.id ?? ''),
        },
      },
    });
    const systemContent =
      tchat('productAssistant') +
      relevantProducts
        .map(
          (product) =>
            `Caption: ${product.caption}\n\nRate: ${
              product.rate
            }\n\nDescription: ${product.description}\n\nLink: ${getDomain(
              locale,
              product.slug
            )}`
        )
        .join('\n\n') +
      tchat('productAssistantLinkSample');

    const langChainMessages = [
      new SystemMessage({ content: systemContent }),
      ...messagesTruncated.map((msg) =>
        msg.role === 'user'
          ? new HumanMessage({ content: msg.content })
          : new AIMessage({ content: msg.content })
      ),
    ];
    const stream = await chatModel.stream(langChainMessages);
    return LangChainAdapter.toDataStreamResponse(stream);
  } catch (error) {
    console.error(error);
    return errorResponse(te('errorOccured'));
  }
}
