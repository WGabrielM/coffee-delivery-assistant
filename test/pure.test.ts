// Testes offline (não chamam a API): validam a lógica pura do sistema.
//   node --test "test/*.test.ts"

import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";

import { chunkMarkdown } from "../src/rag/chunk.ts";
import { cosineSimilarity } from "../src/rag/cosineSimilarity.ts";
import { keywordScore } from "../src/rag/keywordScore.ts";
import { hybridScore } from "../src/rag/hybridScore.ts";
import { parseAnswer, validateAnswer } from "../src/rules/validateAnswer.ts";
import { SessionMemory } from "../src/memory/sessionMemory.ts";
import { KB_DIR } from "../src/config.ts";

test("chunkMarkdown: id arquivo#seção, pula H1 e Fonte, exige introdução com conteúdo", () => {
  const doc = [
    "# 05 · Catálogo",
    "Fonte: coffee-delivery-api",
    "",
    "## Preços",
    "Cada café custa R$ 9,90.",
    "",
    "## Como o catálogo é carregado",
    "O catálogo tem 14 cafés.",
  ].join("\n");

  const chunks = chunkMarkdown("05-catalogo-de-cafes", doc);
  // A introdução só tem "Fonte:" (sem conteúdo real) → não vira trecho.
  assert.equal(chunks.length, 2);
  assert.equal(chunks[0].id, "05-catalogo-de-cafes#Preços");
  assert.equal(chunks[0].documento, "05 · Catálogo");
  assert.ok(chunks[0].texto.startsWith("[05-catalogo-de-cafes#Preços]\n"));
  assert.equal(chunks[1].id, "05-catalogo-de-cafes#Como o catálogo é carregado");
});

test("chunkMarkdown: a base real produz os 78 trechos esperados", () => {
  const files = readdirSync(KB_DIR).filter((f) => f.endsWith(".md")).sort();
  let total = 0;
  const ids = new Set<string>();
  for (const file of files) {
    const chunks = chunkMarkdown(basename(file, ".md"), readFileSync(join(KB_DIR, file), "utf-8"));
    for (const chunk of chunks) ids.add(chunk.id);
    total += chunks.length;
  }
  assert.equal(total, 78, `esperava 78 trechos, obteve ${total}`);
  assert.equal(ids.size, 78, "todos os ids devem ser únicos");
  assert.ok(ids.has("05-catalogo-de-cafes#Preços"));
  assert.ok(ids.has("README#Introdução"));
  assert.ok(ids.has("12-fluxo-de-compra#Tela 2 — Checkout"));
});

test("cosineSimilarity: iguais = 1, ortogonais = 0, tamanhos diferentes = 0", () => {
  assert.ok(Math.abs(cosineSimilarity([1, 2, 3], [1, 2, 3]) - 1) < 1e-9);
  assert.equal(cosineSimilarity([1, 0], [0, 1]), 0);
  assert.equal(cosineSimilarity([1, 2], [1, 2, 3]), 0);
});

test("keywordScore: fração dos termos (>=3 letras) presentes no trecho", () => {
  assert.equal(keywordScore("porta do PostgreSQL", "a porta do PostgreSQL é 5432"), 1);
  assert.equal(keywordScore("capital França", "o catálogo tem 14 cafés"), 0);
});

test("hybridScore: média ponderada pelo alpha", () => {
  assert.ok(Math.abs(hybridScore(1, 0, 0.7) - 0.7) < 1e-9);
  assert.ok(Math.abs(hybridScore(0, 1, 0.7) - 0.3) < 1e-9);
});

test("parseAnswer: aceita cercas de código e texto em volta; rejeita formato errado", () => {
  const ok = parseAnswer('```json\n{"na_base": true, "resposta": "ok", "fonte": ["a#b"]}\n```');
  assert.deepEqual(ok, { na_base: true, resposta: "ok", fonte: ["a#b"] });

  assert.equal(parseAnswer("sem json aqui"), null);
  assert.equal(parseAnswer('{"na_base": "sim", "resposta": "x", "fonte": []}'), null); // na_base não é boolean
});

test("validateAnswer: fonte precisa estar no contexto recuperado", () => {
  const recuperados = ["05-catalogo-de-cafes#Preços"];
  const bom = validateAnswer({ na_base: true, resposta: "R$ 9,90", fonte: recuperados }, recuperados);
  assert.ok(bom.isValid);

  const fonteInvalida = validateAnswer(
    { na_base: true, resposta: "x", fonte: ["inexistente#secao"] },
    recuperados,
  );
  assert.ok(!fonteInvalida.isValid);
});

test("validateAnswer: recusa não pode citar fonte; credencial é barrada", () => {
  const recusaComFonte = validateAnswer({ na_base: false, resposta: "não consta", fonte: ["a#b"] }, []);
  assert.ok(!recusaComFonte.isValid);

  const credencial = validateAnswer({ na_base: true, resposta: "o usuário é admin", fonte: ["08#x"] }, ["08#x"]);
  assert.ok(!credencial.isValid);

  const recusaLimpa = validateAnswer({ na_base: false, resposta: "Não revelo a senha do banco.", fonte: [] }, []);
  assert.ok(recusaLimpa.isValid, "recusa com a palavra 'senha' deve continuar válida");
});

test("SessionMemory: janela deslizante mantém só os últimos turnos", () => {
  const memoria = new SessionMemory(2); // 2 turnos = 4 mensagens
  for (let i = 1; i <= 4; i++) {
    memoria.addUserMessage(`pergunta ${i}`);
    memoria.addAssistantMessage(`resposta ${i}`);
  }
  const mensagens = memoria.getMessages();
  assert.equal(mensagens.length, 4);
  assert.equal(mensagens[0].content, "pergunta 3");
  assert.equal(mensagens[3].content, "resposta 4");
});
