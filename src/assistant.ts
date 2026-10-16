// ORQUESTRADOR: amarra as quatro camadas em um fluxo por pergunta.
//
//   pergunta
//     → contextualização do follow-up (usa a memória)      [rag/contextualizeQuery]
//     → recuperação (RAG)                     [rag/retrieve]
//     → montagem do prompt com regras + memória [rules/systemPrompt, memory/*]
//     → geração (LLM)                          [clients/openai]
//     → validação da saída                     [rules/validateAnswer]
//     → atualização da memória de sessão       [memory/sessionMemory]
//
// Este é o "fluxo de uma requisição do início ao fim" da seção 1.

import { openai, callOpenAI } from "./clients/openai.ts";
import { CHAT_MODEL, TEMPERATURE } from "./config.ts";
import type { AssistantResult } from "./types.ts";
import { retrieve } from "./rag/retrieve.ts";
import { contextualizeQuery } from "./rag/contextualizeQuery.ts";
import { VectorStore } from "./rag/vectorStore.ts";
import { SessionMemory } from "./memory/sessionMemory.ts";
import { PersistentMemory, formatFactsBlock } from "./memory/persistentMemory.ts";
import { buildMessages } from "./rules/systemPrompt.ts";
import { parseAnswer, validateAnswer, FALLBACK_ANSWER } from "./rules/validateAnswer.ts";
import type { Message } from "./types.ts";

/** Memória persistente ligada a uma sessão específica (opcional). */
export type PersistentContext = {
  sessionId: string;
  memory: PersistentMemory;
};

export class Assistant {
  private store: VectorStore;
  private session: SessionMemory;
  private persistent?: PersistentContext;

  constructor(store: VectorStore, session: SessionMemory, persistent?: PersistentContext) {
    this.store = store;
    this.session = session;
    this.persistent = persistent;
  }

  /** Processa uma pergunta e devolve resposta, trechos usados, texto cru e validação. */
  async ask(question: string): Promise<AssistantResult> {
    // 1. Contextualização: resolve o follow-up ("...deles?") numa pergunta
    //    autônoma usando o histórico, para a busca não perder o trecho certo.
    const searchQuery = await contextualizeQuery(question, this.session.getMessages());

    // 2. Recuperação (RAG): trechos relevantes para a pergunta contextualizada.
    const retrieved = await retrieve(searchQuery, this.store);

    // 3. Memória persistente (fatos entre sessões) entra como bloco no sistema.
    const factsBlock = this.persistent
      ? formatFactsBlock(this.persistent.memory.all(this.persistent.sessionId))
      : "";

    // 4. Monta o prompt: regras + fatos + histórico da sessão + contexto + pergunta
    //    ORIGINAL (a geração responde à pergunta do usuário, não à reescrita).
    const messages = buildMessages(question, retrieved, this.session.getMessages(), factsBlock);

    // 5. Geração.
    const raw = await this.generate(messages);

    // 6. Validação da saída contra o contrato de regras.
    const answer = parseAnswer(raw) ?? FALLBACK_ANSWER;
    const validation = validateAnswer(answer, retrieved.map((chunk) => chunk.id));

    // 7. Atualiza a memória de sessão (guarda a pergunta e a resposta crua).
    this.session.addUserMessage(question);
    this.session.addAssistantMessage(raw);

    return { answer, retrieved, raw, validation };
  }

  /** Chamada ao modelo de geração, em modo JSON e temperatura baixa. */
  private async generate(messages: Message[]): Promise<string> {
    const response = await callOpenAI(() =>
      openai.chat.completions.create({
        model: CHAT_MODEL,
        temperature: TEMPERATURE.grounded,
        response_format: { type: "json_object" },
        messages,
      }),
    );
    return response.choices[0]?.message?.content ?? "";
  }
}
