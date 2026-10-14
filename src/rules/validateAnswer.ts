// Validação da saída do modelo contra o contrato de regras.
// Faz duas coisas: (1) interpreta o JSON do contrato de forma tolerante e
// (2) verifica se a resposta respeita as regras (fonte válida, coerência do
// campo na_base, e nenhuma credencial vazada).

import { CREDENTIAL_PATTERN } from "../config.ts";
import type { AssistantAnswer, ValidationResult } from "../types.ts";

/**
 * Interpreta o texto cru do modelo como o JSON do contrato.
 * Tolera cercas de código (```json) e texto em volta. Retorna null se não for
 * possível obter um objeto com os três campos no formato certo.
 */
export function parseAnswer(raw: string): AssistantAnswer | null {
  const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");

  // Pega o primeiro objeto {...} caso haja texto em volta.
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned.slice(start, end + 1));
  } catch {
    return null;
  }
  if (typeof parsed !== "object" || parsed === null) return null;

  const obj = parsed as Record<string, unknown>;
  const { na_base, resposta, fonte } = obj;

  if (typeof na_base !== "boolean") return null;
  if (typeof resposta !== "string") return null;
  if (!Array.isArray(fonte) || !fonte.every((f) => typeof f === "string")) return null;

  return { na_base, resposta, fonte: fonte as string[] };
}

/**
 * Verifica se a resposta respeita as regras, dados os ids dos trechos que foram
 * de fato recuperados neste turno.
 */
export function validateAnswer(answer: AssistantAnswer, retrievedIds: string[]): ValidationResult {
  const errors: string[] = [];
  const retrieved = new Set(retrievedIds);

  // Regra: não vazar credenciais (checa o valor do segredo, não a palavra "senha").
  if (CREDENTIAL_PATTERN.test(answer.resposta)) {
    errors.push("A resposta parece expor uma credencial.");
  }

  if (answer.na_base) {
    // Afirmou que está na base: precisa citar ao menos uma fonte...
    if (answer.fonte.length === 0) {
      errors.push("na_base é true mas nenhuma fonte foi citada.");
    }
    // ...e toda fonte citada precisa estar entre os trechos recuperados.
    for (const source of answer.fonte) {
      if (!retrieved.has(source)) {
        errors.push(`Fonte citada não está no contexto recuperado: ${source}`);
      }
    }
  } else {
    // Recusou: a fonte precisa estar vazia (não se cita o que não se usou).
    if (answer.fonte.length > 0) {
      errors.push("na_base é false mas há fontes citadas.");
    }
  }

  return { isValid: errors.length === 0, errors };
}

/** Resposta de fallback quando o modelo devolve algo que nem é JSON do contrato. */
export const FALLBACK_ANSWER: AssistantAnswer = {
  na_base: false,
  resposta: "Não consegui produzir uma resposta no formato esperado.",
  fonte: [],
};
