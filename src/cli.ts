// CHATBOT CLI (yarn chat): conversa multi-turno no terminal.
// Mantém a memória de sessão (contexto da conversa) e a memória persistente
// (fatos entre sessões, por `sessionId`). Encerra com "sair", Ctrl+C ou EOF.
//
//   yarn chat [sessionId]
//
// O `sessionId` (padrão "default") escolhe de qual conjunto de fatos persistentes
// a conversa parte — rode duas vezes com o mesmo id para ver a memória sobreviver.

import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { assertApiKey } from "./clients/openai.ts";
import { Assistant } from "./assistant.ts";
import { SessionMemory } from "./memory/sessionMemory.ts";
import { PersistentMemory } from "./memory/persistentMemory.ts";
import { VectorStore } from "./rag/vectorStore.ts";

assertApiKey();

const sessionId = process.argv[2] ?? "default";

const store = new VectorStore();
if (store.count() === 0) {
  console.error("O banco vetorial está vazio. Rode `yarn ingest` primeiro.");
  process.exit(1);
}

const persistent = new PersistentMemory();
const assistant = new Assistant(store, new SessionMemory(), { sessionId, memory: persistent });

console.log(`Assistente do Coffee Delivery (sessão: ${sessionId}). Digite "sair" para encerrar.\n`);

const rl = createInterface({ input: stdin, output: stdout });

while (true) {
  const question = (await rl.question("você › ")).trim();
  if (question.length === 0) continue;
  if (question.toLowerCase() === "sair") break;

  try {
    const result = await assistant.ask(question);
    console.log(`bot  › ${result.answer.resposta}`);
    if (result.answer.fonte.length > 0) {
      console.log(`       fonte: ${result.answer.fonte.join(", ")}`);
    }
    console.log();
  } catch (error) {
    console.error("Falha ao responder:", error instanceof Error ? error.message : error);
  }
}

rl.close();
store.close();
persistent.close();
