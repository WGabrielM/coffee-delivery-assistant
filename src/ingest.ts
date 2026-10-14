// INGESTÃO (yarn ingest): lê a base de conhecimento, divide em trechos por seção,
// gera os embeddings e grava no vector store. Idempotente — rodar de novo não duplica.

import { readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";
import { assertApiKey } from "./clients/openai.ts";
import { KB_DIR } from "./config.ts";
import { chunkMarkdown } from "./rag/chunk.ts";
import { embed } from "./rag/embed.ts";
import { VectorStore } from "./rag/vectorStore.ts";

assertApiKey();

const files = readdirSync(KB_DIR).filter((file) => file.endsWith(".md")).sort();
if (files.length === 0) {
  console.error(`Nenhum arquivo .md encontrado em ${KB_DIR}/`);
  process.exit(1);
}

const store = new VectorStore();
let total = 0;

for (const file of files) {
  const stem = basename(file, ".md");
  const text = readFileSync(join(KB_DIR, file), "utf-8");
  const chunks = chunkMarkdown(stem, text);
  for (const chunk of chunks) {
    const embedding = await embed(chunk.texto);
    store.upsert(chunk.id, chunk.documento, chunk.texto, embedding);
    total++;
  }
  console.log(`  ${file}: ${chunks.length} trechos`);
}

console.log(`\nIngestão concluída: ${total} trechos processados, ${store.count()} no banco.`);
store.close();
