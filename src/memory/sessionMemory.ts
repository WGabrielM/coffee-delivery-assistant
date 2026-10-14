// MEMÓRIA DE SESSÃO: o histórico da conversa atual, em uma janela deslizante.
// Guarda os turnos mais recentes e descarta os antigos quando a janela estoura,
// para o contexto não crescer sem limite. É o que permite um follow-up como
// "e quanto custa o primeiro?" entender a que "primeiro" se refere.

import { CONTEXT_WINDOW_TURNS } from "../config.ts";
import type { Message } from "../types.ts";

export class SessionMemory {
  private history: Message[] = [];
  private readonly maxTurns: number;

  /** @param maxTurns número máximo de turnos (par usuário+assistente) mantidos na janela. */
  constructor(maxTurns: number = CONTEXT_WINDOW_TURNS) {
    this.maxTurns = maxTurns;
  }

  addUserMessage(content: string): void {
    this.history.push({ role: "user", content });
    this.applyWindow();
  }

  addAssistantMessage(content: string): void {
    this.history.push({ role: "assistant", content });
    this.applyWindow();
  }

  /** As mensagens dentro da janela, para montar o prompt. */
  getMessages(): Message[] {
    return this.history;
  }

  clear(): void {
    this.history = [];
  }

  /** Mantém só os últimos `maxTurns` turnos e nunca começa por uma resposta órfã. */
  private applyWindow(): void {
    const limit = this.maxTurns * 2; // um turno = 2 mensagens
    if (this.history.length > limit) {
      this.history = this.history.slice(-limit);
    }
    while (this.history.length > 0 && this.history[0].role === "assistant") {
      this.history.shift();
    }
  }
}
