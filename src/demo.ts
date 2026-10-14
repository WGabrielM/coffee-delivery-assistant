// DEMONSTRAÇÃO FUNCIONAL (yarn demo): uma conversa de 3 turnos que exercita,
// de ponta a ponta, a memória de sessão, a recuperação (RAG) e a camada de regras.
//
//   Turno 1 — recuperação pura (o que o catálogo tem).
//   Turno 2 — depende da MEMÓRIA ("cada um deles" = os cafés do turno 1) + recuperação de preços.
//   Turno 3 — depende da MEMÓRIA ("esses") + recuperação sobre pagamento, exercendo a
//             regra de "ausência documentada": o pagamento online não existe, mas isso
//             está escrito na base, então na_base é true, com fonte.
//
// Ao rodar, imprime cada turno e grava o transcrito em docs/demo-transcript.md,
// para a conversa ser reproduzível e anexável ao documento.

import { writeFileSync } from "node:fs";
import { assertApiKey } from "./clients/openai.ts";
import { Assistant } from "./assistant.ts";
import { SessionMemory } from "./memory/sessionMemory.ts";
import { VectorStore } from "./rag/vectorStore.ts";

assertApiKey();

const PERGUNTAS = [
  "Quais cafés o catálogo tem?",
  "Quanto custa cada um deles?",
  "E dá para pagar esses pedidos com cartão online?",
];

const store = new VectorStore();
if (store.count() === 0) {
  console.error("O banco vetorial está vazio. Rode `yarn ingest` primeiro.");
  process.exit(1);
}

const assistant = new Assistant(store, new SessionMemory());
const linhas: string[] = [
  "# Transcrito da demonstração — 3 turnos",
  "",
  "Gerado por `yarn demo`. A conversa exercita memória de sessão, recuperação (RAG) e a camada de regras.",
  "",
];

for (let i = 0; i < PERGUNTAS.length; i++) {
  const pergunta = PERGUNTAS[i];
  const result = await assistant.ask(pergunta);

  console.log(`\n=== Turno ${i + 1} ===`);
  console.log(`você › ${pergunta}`);
  console.log(`bot  › ${result.answer.resposta}`);
  console.log(`       na_base: ${result.answer.na_base} | fonte: ${result.answer.fonte.join(", ") || "—"}`);
  console.log(`       recuperou: ${result.retrieved.map((c) => c.id).join(", ") || "—"}`);

  linhas.push(
    `## Turno ${i + 1}`,
    "",
    `**Pergunta:** ${pergunta}`,
    "",
    `**Resposta:** ${result.answer.resposta}`,
    "",
    `- \`na_base\`: ${result.answer.na_base}`,
    `- Fonte citada: ${result.answer.fonte.map((f) => `\`${f}\``).join(", ") || "—"}`,
    `- Trechos recuperados: ${result.retrieved.map((c) => `\`${c.id}\` (${c.score.toFixed(2)})`).join(", ") || "—"}`,
    `- Validação: ${result.validation.isValid ? "ok" : result.validation.errors.join("; ")}`,
    "",
  );
}

linhas.push(
  "## O que esta conversa demonstra",
  "",
  "- **Memória de sessão:** os turnos 2 e 3 não repetem \"cafés\"/\"pedidos\" — o assistente entende a referência pelo histórico.",
  "- **Recuperação (RAG):** cada turno busca os trechos relevantes à pergunta, não a base inteira.",
  "- **Camada de regras:** o turno 3 responde com `na_base: true` e fonte mesmo o recurso não existindo, porque a base documenta a ausência.",
  "",
);

writeFileSync("docs/demo-transcript.md", linhas.join("\n"), "utf-8");
console.log("\nTranscrito salvo em docs/demo-transcript.md");
store.close();
