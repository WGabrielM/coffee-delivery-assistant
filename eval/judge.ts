// Juiz por LLM (seção 4). Um modelo avalia duas dimensões que não dá para medir
// por comparação exata de string:
//   - FIDELIDADE: a resposta se apoia apenas nos trechos recuperados?
//   - COERÊNCIA DO HISTÓRICO: o follow-up usa corretamente o que foi dito antes?
//
// Use um JUDGE_MODEL de família diferente do avaliado (config.ts) para o juiz não
// repetir os mesmos pontos cegos. Notas de 0 a 2.

import { openai, callOpenAI } from "../src/clients/openai.ts";
import { JUDGE_MODEL, TEMPERATURE } from "../src/config.ts";

async function nota(system: string, user: string): Promise<number> {
  const response = await callOpenAI(() =>
    openai.chat.completions.create({
      model: JUDGE_MODEL,
      temperature: TEMPERATURE.judge,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  );
  try {
    const parsed = JSON.parse(response.choices[0]?.message?.content ?? "{}") as { nota?: unknown };
    const value = Number(parsed.nota);
    if (!Number.isFinite(value)) return 0;
    return Math.max(0, Math.min(2, Math.round(value)));
  } catch {
    return 0;
  }
}

const FIDELIDADE_SYSTEM = `
Você avalia a FIDELIDADE de uma resposta aos trechos de contexto fornecidos.
Dê uma nota inteira de 0 a 2 e responda APENAS com {"nota": 0|1|2}.
- 2: tudo o que a resposta afirma está apoiado nos trechos; nada foi inventado.
- 1: majoritariamente apoiada, mas com algum detalhe não sustentado pelos trechos.
- 0: afirma algo que contradiz os trechos ou que não está neles.
Uma recusa correta ("não consta na base") quando os trechos realmente não trazem a
informação deve receber nota 2.
`.trim();

const COERENCIA_SYSTEM = `
Você avalia a COERÊNCIA DO HISTÓRICO de uma resposta em uma conversa.
A pergunta atual depende de turnos anteriores (ex.: "cada um deles", "a primeira").
Dê uma nota inteira de 0 a 2 e responda APENAS com {"nota": 0|1|2}.
- 2: a resposta resolve corretamente a referência ao que foi dito antes.
- 1: resolve parcialmente ou de forma ambígua.
- 0: ignora o histórico ou resolve a referência errada.
`.trim();

/** Fidelidade da resposta aos trechos recuperados (0..2). */
export function julgarFidelidade(
  pergunta: string,
  contexto: string,
  resposta: string,
): Promise<number> {
  return nota(
    FIDELIDADE_SYSTEM,
    `<contexto>\n${contexto}\n</contexto>\n\n<pergunta>\n${pergunta}\n</pergunta>\n\n<resposta>\n${resposta}\n</resposta>`,
  );
}

/** Coerência do follow-up com o histórico da conversa (0..2). */
export function julgarCoerencia(
  historico: string,
  pergunta: string,
  resposta: string,
): Promise<number> {
  return nota(
    COERENCIA_SYSTEM,
    `<historico>\n${historico}\n</historico>\n\n<pergunta>\n${pergunta}\n</pergunta>\n\n<resposta>\n${resposta}\n</resposta>`,
  );
}
