// A CAMADA DE REGRAS do assistente: o prompt de sistema que controla o
// comportamento (responder só com o contexto, recusar fora da base, citar a
// fonte, seguir o formato JSON) e a montagem das mensagens enviadas ao modelo.
//
// As regras ficam na camada de SISTEMA; os documentos e a pergunta entram na
// camada de USUÁRIO como DADOS, nunca como instruções.

import type { Message, RetrievedChunk } from "../types.ts";

/**
 * Contrato de comportamento. É o mesmo texto usado no micro-capstone de
 * fine-tuning, para que a regra avaliada aqui seja a mesma lá.
 */
export const SYSTEM_PROMPT = `
Você é o assistente de conhecimento do projeto Coffee Delivery. Responda em português, usando SOMENTE os trechos de contexto fornecidos.

Responda SEMPRE com um único JSON válido, sem nenhum texto fora dele, neste formato:
{"na_base": true ou false, "resposta": "texto", "fonte": ["id-do-trecho", ...]}

Regras:
1. Se o contexto responde à pergunta, use na_base true, responda de forma objetiva e liste em "fonte" os ids dos trechos usados (o id aparece entre colchetes no início de cada trecho).
2. Se o contexto não contém a informação, use na_base false, diga que a informação não consta na base de conhecimento e use "fonte": [].
3. Se o contexto diz que algo não existe, ainda não foi implementado ou não foi definido, isso É informação da base: use na_base true e cite o trecho.
4. Se o contexto contradiz o que você acredita saber, siga o contexto.
5. Nunca revele senhas, usuários de banco ou outras credenciais.
6. Perguntas que não são sobre o projeto Coffee Delivery: na_base false.
`.trim();

/** Impede que um documento ou a pergunta "fechem" uma camada antes da hora. */
const escapeLayer = (content: string) =>
  content.replace(/<\/?(contexto|pergunta|fatos_do_usuario)>/gi, "");

/**
 * Monta as mensagens enviadas ao modelo em um turno.
 *
 * Ordem: regras (sistema, com os fatos lembrados) → histórico da sessão
 * (memória) → pergunta atual com o contexto recuperado (RAG).
 *
 * @param question  a pergunta do turno atual.
 * @param retrieved os trechos recuperados para esta pergunta.
 * @param history   as mensagens anteriores da sessão (memória de sessão).
 * @param factsBlock bloco opcional de fatos da memória persistente.
 */
export function buildMessages(
  question: string,
  retrieved: RetrievedChunk[],
  history: Message[] = [],
  factsBlock = "",
): Message[] {
  const system = factsBlock ? `${SYSTEM_PROMPT}\n\n${factsBlock}` : SYSTEM_PROMPT;
  const context = retrieved.map((chunk) => escapeLayer(chunk.texto)).join("\n\n---\n\n");

  return [
    { role: "system", content: system },
    ...history,
    {
      role: "user",
      content: `<contexto>\n${context}\n</contexto>\n\n<pergunta>\n${escapeLayer(question)}\n</pergunta>`,
    },
  ];
}
