// MEMÓRIA PERSISTENTE: fatos que sobrevivem entre sessões (ex.: nome do usuário,
// preferência de café, cidade de entrega). Fica FORA do histórico da conversa,
// em um banco SQLite, indexada por sessão/usuário. Enquanto a memória de sessão
// se perde ao fechar o programa, esta é relida na sessão seguinte.

import { DatabaseSync } from "node:sqlite";
import { MEMORY_DB_PATH } from "../config.ts";

/** Fatos de um usuário, como pares chave → valor. */
export type Facts = Record<string, string>;

export class PersistentMemory {
  private db: DatabaseSync;

  constructor(dbPath: string = MEMORY_DB_PATH) {
    this.db = new DatabaseSync(dbPath);
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS facts (
        session_id TEXT NOT NULL,
        key TEXT NOT NULL,
        value TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (session_id, key)
      )
    `);
  }

  /** Grava ou atualiza um fato (o valor mais recente vence). */
  remember(sessionId: string, key: string, value: string): void {
    this.db
      .prepare(
        `INSERT INTO facts (session_id, key, value) VALUES (?, ?, ?)
         ON CONFLICT(session_id, key) DO UPDATE SET value = excluded.value,
                                                    updated_at = CURRENT_TIMESTAMP`,
      )
      .run(sessionId, key, value);
  }

  /** Todos os fatos conhecidos de uma sessão. */
  all(sessionId: string): Facts {
    const rows = this.db
      .prepare(`SELECT key, value FROM facts WHERE session_id = ? ORDER BY key`)
      .all(sessionId) as { key: string; value: string }[];
    const facts: Facts = {};
    for (const row of rows) facts[row.key] = row.value;
    return facts;
  }

  forget(sessionId: string): void {
    this.db.prepare(`DELETE FROM facts WHERE session_id = ?`).run(sessionId);
  }

  close(): void {
    this.db.close();
  }
}

/**
 * Formata os fatos como um bloco para o prompt de sistema.
 * Os fatos são DADOS, então eventuais marcas de camada são removidas.
 */
export function formatFactsBlock(facts: Facts): string {
  const keys = Object.keys(facts);
  if (keys.length === 0) return "";
  const lines = keys.map((key) => `- ${key}: ${facts[key].replace(/<\/?fatos_do_usuario>/gi, "")}`);
  return `<fatos_do_usuario>\nFatos conhecidos do usuário, de sessões anteriores (o valor mais recente vence):\n${lines.join("\n")}\n</fatos_do_usuario>`;
}
