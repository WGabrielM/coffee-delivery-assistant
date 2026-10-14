// Vector store local em SQLite (node:sqlite, sem dependência externa).
// Guarda cada trecho com seu id e embedding, e faz a busca híbrida
// (semântica + palavra-chave) com top-k e limiar de relevância.

import { DatabaseSync } from "node:sqlite";
import {
  RAG_TOP_K,
  RAG_MIN_SCORE,
  RAG_SEMANTIC_WEIGHT,
  VECTOR_DB_PATH,
} from "../config.ts";
import type { RetrievedChunk } from "../types.ts";
import { cosineSimilarity } from "./cosineSimilarity.ts";
import { keywordScore } from "./keywordScore.ts";
import { hybridScore } from "./hybridScore.ts";

export class VectorStore {
  private db: DatabaseSync;

  constructor(dbPath: string = VECTOR_DB_PATH) {
    this.db = new DatabaseSync(dbPath);
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS chunks (
        id TEXT PRIMARY KEY,
        documento TEXT NOT NULL,
        texto TEXT NOT NULL,
        embedding TEXT NOT NULL
      )
    `);
  }

  /** Insere ou substitui um trecho (idempotente: re-ingerir não duplica). */
  upsert(id: string, documento: string, texto: string, embedding: number[]): void {
    this.db
      .prepare(
        `INSERT INTO chunks (id, documento, texto, embedding) VALUES (?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET documento = excluded.documento,
                                       texto = excluded.texto,
                                       embedding = excluded.embedding`,
      )
      .run(id, documento, texto, JSON.stringify(embedding));
  }

  count(): number {
    const row = this.db.prepare(`SELECT COUNT(*) AS total FROM chunks`).get() as { total: number };
    return Number(row.total);
  }

  /**
   * Busca os trechos mais relevantes para a pergunta.
   * A pontuação final mistura similaridade semântica (embedding) e
   * sobreposição de palavras; só retorna o que passa do limiar.
   *
   * @param query          a pergunta em texto (para o score de palavra-chave).
   * @param queryEmbedding o embedding da pergunta (para o score semântico).
   */
  search(
    query: string,
    queryEmbedding: number[],
    topK: number = RAG_TOP_K,
    minScore: number = RAG_MIN_SCORE,
  ): RetrievedChunk[] {
    const rows = this.db
      .prepare(`SELECT id, texto, embedding FROM chunks`)
      .all() as { id: string; texto: string; embedding: string }[];

    return rows
      .map((row) => ({
        id: row.id,
        texto: row.texto,
        score: hybridScore(
          cosineSimilarity(queryEmbedding, JSON.parse(row.embedding) as number[]),
          keywordScore(query, row.texto),
          RAG_SEMANTIC_WEIGHT,
        ),
      }))
      .filter((result) => result.score >= minScore)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }

  close(): void {
    this.db.close();
  }
}
