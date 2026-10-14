// CONSULTA ÚNICA (yarn ask "pergunta"): ferramenta de inspeção do RAG.
// Mostra os trechos recuperados com seus scores e a resposta do assistente.
// Útil para calibrar RAG_TOP_K e RAG_MIN_SCORE olhando números reais.

import { assertApiKey } from "./clients/openai.ts";
import { Assistant } from "./assistant.ts";
import { SessionMemory } from "./memory/sessionMemory.ts";
import { VectorStore } from "./rag/vectorStore.ts";

assertApiKey();

const question = process.argv[2] ?? "Quantos cafés tem no catálogo?";

const store = new VectorStore();
if (store.count() === 0) {
  console.error("O banco vetorial está vazio. Rode `yarn ingest` primeiro.");
  process.exit(1);
}

const assistant = new Assistant(store, new SessionMemory());
const result = await assistant.ask(question);

console.log(`Pergunta: ${question}\n`);
console.log("Trechos recuperados (id — score):");
if (result.retrieved.length === 0) {
  console.log("  (nenhum passou do limiar de relevância)");
} else {
  for (const chunk of result.retrieved) {
    console.log(`  ${chunk.score.toFixed(3)}  ${chunk.id}`);
  }
}

console.log("\nResposta:");
console.log(JSON.stringify(result.answer, null, 2));

if (!result.validation.isValid) {
  console.log("\n⚠ Problemas de validação:");
  for (const error of result.validation.errors) console.log(`  - ${error}`);
}

store.close();
