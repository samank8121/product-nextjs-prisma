import { Pinecone } from "@pinecone-database/pinecone";

const apiKey = process.env.PINECONE_API_KEY;

if (!apiKey) {
  throw Error("PINECONE_API_KEY is not set");
}

const pc = new Pinecone({
  apiKey
});
export const productIndex = pc.index('quickstart', process.env.PINECONE_HOST_URL);
