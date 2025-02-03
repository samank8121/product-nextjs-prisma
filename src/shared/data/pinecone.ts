import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore  } from "@langchain/pinecone";
import OAIembeddings from "../utils/openai";

const apiKey = process.env.PINECONE_API_KEY;

if (!apiKey) {
  throw Error("PINECONE_API_KEY is not set");
}

const pinecone = new Pinecone({
  apiKey
});
const pineconeIndex = pinecone.Index("quickstart",process.env.PINECONE_HOST_URL) as any;
export const pineconeStore = new PineconeStore(
  OAIembeddings,
  { pineconeIndex, namespace: "product-ns" }
);
