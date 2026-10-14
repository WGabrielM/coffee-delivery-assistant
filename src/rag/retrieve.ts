// Recuperação de alto nível: embute a pergunta e busca os trechos no vector store.
// É o ponto único de entrada do RAG usado pelo orquestrador e pela avaliação.

import type { RetrievedChunk } from "../types.ts";
import { embed } from "./embed.ts";
import { VectorStore } from "./vectorStore.ts";

export async function retrieve(question: string, store: VectorStore): Promise<RetrievedChunk[]> {
  const queryEmbedding = await embed(question);
  return store.search(question, queryEmbedding);
}
