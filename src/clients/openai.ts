// Cliente da OpenAI e utilitário de chamada com retry e contagem de uso.
// Toda chamada à API passa por `callOpenAI` para ter uma política única de
// retentativa e para a avaliação conseguir medir o custo (tokens).

import OpenAI from "openai";

export const openai = new OpenAI({
  // Placeholder para que importar este módulo nunca quebre (testes, ferramentas).
  // A chave real é exigida por assertApiKey() em cada ponto de entrada.
  apiKey: process.env.OPENAI_API_KEY || "missing-api-key",
  maxRetries: 0, // o retry é nosso (withRetry abaixo), para ter uma política visível
  timeout: 60_000,
});

/** Interrompe o programa cedo, com mensagem clara, se a chave não estiver configurada. */
export function assertApiKey(): void {
  if (!process.env.OPENAI_API_KEY) {
    console.error(
      "OPENAI_API_KEY não configurada. Copie .env.example para .env.local e preencha a chave.",
    );
    process.exit(1);
  }
}

/** Totais acumulados de uso, lidos pela avaliação para estimar o custo. */
export type CallStats = { calls: number; promptTokens: number; completionTokens: number };
const stats: CallStats = { calls: 0, promptTokens: 0, completionTokens: 0 };

/** Fotografia dos totais de uso até agora. */
export function snapshotCallStats(): CallStats {
  return { ...stats };
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Executa uma chamada à API com retry por backoff exponencial para erros
 * transitórios (429 e 5xx), e soma os tokens usados em `stats`.
 */
export async function callOpenAI<T extends { usage?: { prompt_tokens?: number; completion_tokens?: number } }>(
  fn: () => Promise<T>,
  maxAttempts = 3,
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const result = await fn();
      stats.calls++;
      stats.promptTokens += result.usage?.prompt_tokens ?? 0;
      stats.completionTokens += result.usage?.completion_tokens ?? 0;
      return result;
    } catch (error) {
      lastError = error;
      const status = (error as { status?: number }).status;
      const transient = status === 429 || (status !== undefined && status >= 500);
      if (!transient || attempt === maxAttempts) break;
      await sleep(500 * 2 ** (attempt - 1)); // 500ms, 1s, 2s...
    }
  }
  throw lastError;
}
