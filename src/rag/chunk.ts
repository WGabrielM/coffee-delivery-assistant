// Divide um documento Markdown da base em trechos: uma seção `## ` vira um trecho.
// O id do trecho é `arquivo#seção` (ex.: `05-catalogo-de-cafes#Preços`).
//
// Esta é a decisão de CHUNKING do pipeline RAG (seção 3): seções escritas por
// quem conhece o projeto são unidades semânticas melhores do que janelas de N
// caracteres, e o cabeçalho da seção já identifica o trecho para a citação.

import type { Chunk } from "../types.ts";

/**
 * Gera os trechos de um documento Markdown.
 *
 * @param filename nome do arquivo sem extensão (ex.: `05-catalogo-de-cafes`), usado no id.
 * @param text     conteúdo do arquivo.
 * @returns lista de trechos, cada um com o id `arquivo#seção` já embutido no texto.
 */
export function chunkMarkdown(filename: string, text: string): Chunk[] {
  const titleMatch = text.match(/^# (.*)/m);
  const documento = titleMatch ? titleMatch[1].trim() : filename;

  // Separa o cabeçalho (antes da primeira seção) das seções `## `.
  const parts = text.split(/^## /m);
  const head = parts[0];
  const sections = parts.slice(1);

  const chunks: Chunk[] = [];

  // A introdução (texto antes da primeira seção) só entra se tiver conteúdo real,
  // sem o título H1 e sem a linha `Fonte:`.
  const body = head.replace(/^# .*\n/, "").trim();
  const bodyWithoutFonte = body.replace(/^Fonte:.*$/gm, "").trim();
  if (bodyWithoutFonte.length >= 60) {
    const id = `${filename}#Introdução`;
    chunks.push({ id, documento, secao: "Introdução", texto: `[${id}]\n${body}` });
  }

  for (const section of sections) {
    const newline = section.indexOf("\n");
    const secao = (newline === -1 ? section : section.slice(0, newline)).trim();
    const rest = (newline === -1 ? "" : section.slice(newline + 1)).trim();
    const id = `${filename}#${secao}`;
    chunks.push({ id, documento, secao, texto: `[${id}]\n${rest}` });
  }

  return chunks;
}
