import { OpenAIEmbeddings } from '@langchain/openai';

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw Error("OPENAI_API_KEY is not set");
}

const OAIembeddings = new OpenAIEmbeddings({
  openAIApiKey: apiKey,
  modelName: "text-embedding-ada-002",
});

export default OAIembeddings;

export async function getEmbedding(text: string) {
  const embedding = await OAIembeddings.embedQuery(text);
  
  if (!embedding) throw new Error("Error generating embedding.");

  return embedding;
}
