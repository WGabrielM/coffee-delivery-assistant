// Gera o embedding (vetor) de um texto, usado tanto na ingestão quanto na busca.

import { openai, callOpenAI } from "../clients/openai.ts";
import { EMBEDDING_MODEL } from "../config.ts";

export async function embed(input: string): Promise<number[]> {
  const response = await callOpenAI(() =>
    openai.embeddings.create({ model: EMBEDDING_MODEL, input }),
  );
  return response.data[0].embedding;
}
