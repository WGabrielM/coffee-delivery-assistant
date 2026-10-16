// CONTEXTUALIZAÇÃO DA CONSULTA: antes de recuperar, reescreve um follow-up
// ("quanto custa cada um deles?") numa pergunta autônoma ("quanto custam os
// cafés do catálogo?"), usando o histórico da sessão para resolver pronomes e
// referências. A memória de sessão já alimentava a GERAÇÃO; aqui ela passa a
// alimentar também a RECUPERAÇÃO, que antes usava a pergunta crua e perdia o
// trecho certo quando o follow-up não trazia as palavras do documento.

import { openai, callOpenAI } from "../clients/openai.ts";
import { CHAT_MODEL, TEMPERATURE, RAG_CONTEXTUALIZE } from "../config.ts";
import type { Message } from "../types.ts";

const REWRITE_SYSTEM = `
Você reescreve a pergunta do usuário em uma versão AUTÔNOMA, para ser usada em uma busca.
Use o histórico apenas para resolver pronomes e referências (ex.: "deles", "isso", "o primeiro", "esse").
Responda SOMENTE com a pergunta reescrita, em português, em uma única linha, sem aspas e sem explicação.
Se a pergunta já for autônoma, repita-a exatamente como está.
`.trim();

/**
 * Devolve a pergunta pronta para a busca. Sem histórico (primeiro turno) ou com
 * a contextualização desligada, devolve a pergunta original sem gastar chamada.
 */
export async function contextualizeQuery(question: string, history: Message[]): Promise<string> {
  if (!RAG_CONTEXTUALIZE || history.length === 0) return question;

  const transcript = history
    .map((m) => `${m.role === "user" ? "Usuário" : "Assistente"}: ${m.content}`)
    .join("\n");

  const response = await callOpenAI(() =>
    openai.chat.completions.create({
      model: CHAT_MODEL,
      temperature: TEMPERATURE.extract,
      messages: [
        { role: "system", content: REWRITE_SYSTEM },
        {
          role: "user",
          content: `<historico>\n${transcript}\n</historico>\n\n<pergunta>\n${question}\n</pergunta>`,
        },
      ],
    }),
  );

  const rewritten = response.choices[0]?.message?.content?.trim();
  return rewritten && rewritten.length > 0 ? rewritten : question;
}
