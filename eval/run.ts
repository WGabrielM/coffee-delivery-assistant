// AVALIAÇÃO (yarn eval): roda o conjunto de perguntas no sistema real e gera o
// relatório da seção 4 — tabela nota a nota, métricas por dimensão e análise de
// falhas. Os números saem desta execução; nada é preenchido à mão.
//
// Dimensões medidas:
//   - Decisão na_base correta (acerta "responder vs. recusar").
//   - Relevância da recuperação (o trecho certo entrou no top-k?).
//   - Fidelidade (juiz 0–2: a resposta se apoia nos trechos?).
//   - Coerência do histórico (juiz 0–2, só nos follow-ups de memória).
//   - Contrato de formato válido e regras respeitadas (validação automática).

import { writeFileSync } from "node:fs";
import { assertApiKey, snapshotCallStats } from "../src/clients/openai.ts";
import { Assistant } from "../src/assistant.ts";
import { SessionMemory } from "../src/memory/sessionMemory.ts";
import { VectorStore } from "../src/rag/vectorStore.ts";
import { parseAnswer } from "../src/rules/validateAnswer.ts";
import { CONVERSAS, TOTAL_TURNOS, type Turno } from "./questions.ts";
import { julgarFidelidade, julgarCoerencia } from "./judge.ts";

assertApiKey();

type Linha = {
  conversa: string;
  turno: number;
  tipo: Turno["tipo"];
  pergunta: string;
  na_base_esperado: boolean;
  na_base_obtido: boolean;
  decisaoCorreta: boolean | null;
  recuperacaoRelevante: boolean | null;
  contratoValido: boolean;
  regrasOk: boolean;
  fidelidade: number;
  coerencia: number | null;
  erros: string[];
};

const store = new VectorStore();
if (store.count() === 0) {
  console.error("O banco vetorial está vazio. Rode `yarn ingest` primeiro.");
  process.exit(1);
}

const linhas: Linha[] = [];

for (const conversa of CONVERSAS) {
  const assistant = new Assistant(store, new SessionMemory());
  const historico: string[] = [];

  for (let i = 0; i < conversa.turnos.length; i++) {
    const turno = conversa.turnos[i];
    const result = await assistant.ask(turno.pergunta);
    const retrievedIds = result.retrieved.map((c) => c.id);
    const contexto = result.retrieved.map((c) => c.texto).join("\n---\n") || "(nenhum trecho recuperado)";

    const decisaoCorreta =
      turno.esperado.avaliar_decisao === false ? null : result.answer.na_base === turno.esperado.na_base;

    const recuperacaoRelevante =
      turno.esperado.fontes && turno.esperado.fontes.length > 0
        ? turno.esperado.fontes.some((f) => retrievedIds.includes(f))
        : null;

    const fidelidade = await julgarFidelidade(turno.pergunta, contexto, result.answer.resposta);
    const coerencia = turno.esperado.depende_de_memoria
      ? await julgarCoerencia(historico.join("\n"), turno.pergunta, result.answer.resposta)
      : null;

    linhas.push({
      conversa: conversa.id,
      turno: i + 1,
      tipo: turno.tipo,
      pergunta: turno.pergunta,
      na_base_esperado: turno.esperado.na_base,
      na_base_obtido: result.answer.na_base,
      decisaoCorreta,
      recuperacaoRelevante,
      contratoValido: parseAnswer(result.raw) !== null,
      regrasOk: result.validation.isValid,
      fidelidade,
      coerencia,
      erros: result.validation.errors,
    });

    historico.push(`Usuário: ${turno.pergunta}`, `Assistente: ${result.answer.resposta}`);
    process.stdout.write(".");
  }
}
process.stdout.write("\n");

// --- Agregações ------------------------------------------------------------

const taxa = (campo: (l: Linha) => boolean | null): string => {
  const avaliados = linhas.map(campo).filter((v): v is boolean => v !== null);
  if (avaliados.length === 0) return "—";
  const ok = avaliados.filter(Boolean).length;
  return `${((ok / avaliados.length) * 100).toFixed(1)}% (${ok}/${avaliados.length})`;
};

const media = (campo: (l: Linha) => number | null): string => {
  const valores = linhas.map(campo).filter((v): v is number => v !== null);
  if (valores.length === 0) return "—";
  return (valores.reduce((a, b) => a + b, 0) / valores.length).toFixed(2);
};

const stats = snapshotCallStats();
const sim = (b: boolean) => (b ? "sim" : "não");
const simNull = (b: boolean | null) => (b === null ? "—" : sim(b));

// --- Relatório em Markdown -------------------------------------------------

const cabecalho = [
  "# Relatório de avaliação — Assistente do Coffee Delivery",
  "",
  `Gerado por \`yarn eval\`. Conjunto: ${TOTAL_TURNOS} perguntas em ${CONVERSAS.length} conversas.`,
  "",
  "## Métricas por dimensão",
  "",
  "| Dimensão | Resultado |",
  "|---|---|",
  `| Decisão na_base correta | ${taxa((l) => l.decisaoCorreta)} |`,
  `| Relevância da recuperação (trecho certo no top-k) | ${taxa((l) => l.recuperacaoRelevante)} |`,
  `| Fidelidade média (0–2) | ${media((l) => l.fidelidade)} |`,
  `| Coerência do histórico média (0–2, follow-ups) | ${media((l) => l.coerencia)} |`,
  `| Contrato de formato válido | ${taxa((l) => l.contratoValido)} |`,
  `| Regras respeitadas (validação) | ${taxa((l) => l.regrasOk)} |`,
  "",
  `Custo da execução: ${stats.calls} chamadas à API, ${stats.promptTokens} tokens de entrada, ${stats.completionTokens} de saída.`,
  "",
  "## Nota por pergunta",
  "",
  "| Conversa·Turno | Tipo | na_base (esp→obt) | Decisão | Recuperação | Fidelidade | Coerência |",
  "|---|---|---|---|---|---|---|",
];

const linhasTabela = linhas.map((l) => {
  const decisao = l.decisaoCorreta === null ? "—" : l.decisaoCorreta ? "ok" : "ERRO";
  const rec = simNull(l.recuperacaoRelevante);
  const coer = l.coerencia === null ? "—" : String(l.coerencia);
  return `| ${l.conversa}·${l.turno} | ${l.tipo} | ${sim(l.na_base_esperado)}→${sim(l.na_base_obtido)} | ${decisao} | ${rec} | ${l.fidelidade} | ${coer} |`;
});

// --- Análise de falhas -----------------------------------------------------

const falhas = linhas.filter(
  (l) => l.decisaoCorreta === false || l.recuperacaoRelevante === false || l.fidelidade < 2 || l.coerencia === 0 || !l.regrasOk,
);

const blocoFalhas = ["", "## Análise de falhas", ""];
if (falhas.length === 0) {
  blocoFalhas.push("Nenhuma falha nas dimensões medidas.");
} else {
  for (const l of falhas) {
    const motivos: string[] = [];
    if (l.decisaoCorreta === false) motivos.push("decisão na_base errada");
    if (l.recuperacaoRelevante === false) motivos.push("trecho esperado não foi recuperado (falha de retrieval)");
    if (l.fidelidade < 2) motivos.push(`fidelidade ${l.fidelidade} (geração)`);
    if (l.coerencia === 0) motivos.push("ignorou o histórico (memória)");
    if (!l.regrasOk) motivos.push(`regra: ${l.erros.join("; ")}`);
    blocoFalhas.push(`- **${l.conversa}·${l.turno}** (${l.pergunta}): ${motivos.join("; ")}.`);
  }
}

const relatorio = [...cabecalho, ...linhasTabela, ...blocoFalhas, ""].join("\n");
writeFileSync("eval/relatorio.md", relatorio, "utf-8");
writeFileSync("eval/resultados.json", JSON.stringify(linhas, null, 2), "utf-8");

console.log("Relatório salvo em eval/relatorio.md e eval/resultados.json");
console.log(`Decisão correta: ${taxa((l) => l.decisaoCorreta)} | Fidelidade média: ${media((l) => l.fidelidade)}`);
store.close();
