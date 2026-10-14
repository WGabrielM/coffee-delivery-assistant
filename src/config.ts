// Ponto único de configuração: todo valor ajustável do sistema fica aqui.
// Sobrescreva pelo arquivo .env.local sem mexer no código.

const toNumber = (value: string | undefined, fallback: number): number => {
  if (value === undefined || value.trim() === "") return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

// ---------------------------------------------------------------------------
// Modelos
// ---------------------------------------------------------------------------

/** Modelo de geração. Fixe uma versão datada no .env.local para o comportamento não mudar sozinho. */
export const CHAT_MODEL = process.env.OPENAI_CHAT_MODEL ?? "gpt-4o-mini";

/**
 * Modelo usado como juiz na avaliação (seção 4).
 * Prefira uma família/tamanho DIFERENTE do modelo avaliado: um juiz que
 * compartilha os pontos cegos do avaliado deixa passar os mesmos erros.
 */
export const JUDGE_MODEL = process.env.OPENAI_JUDGE_MODEL ?? CHAT_MODEL;

/**
 * Modelo de embedding. Trocar exige re-ingerir toda a base (vetores de modelos
 * diferentes não são comparáveis), por isso não é configurável por .env.
 */
export const EMBEDDING_MODEL = "text-embedding-3-small";

/** Temperatura baixa onde a resposta precisa ser factual e reproduzível. */
export const TEMPERATURE = {
  grounded: 0.1, // resposta ancorada no contexto
  judge: 0, // avaliação (juiz)
  extract: 0, // extração de fatos para a memória persistente
} as const;

// ---------------------------------------------------------------------------
// RAG (seção 3)
// ---------------------------------------------------------------------------

/** Número máximo de trechos recuperados por pergunta. */
export const RAG_TOP_K = toNumber(process.env.RAG_TOP_K, 5);

/**
 * Limiar de relevância: trechos abaixo deste score são descartados.
 * 0.4 é um ponto de partida, não uma verdade — calibre olhando os scores que
 * `yarn ask` imprime para as suas perguntas.
 */
export const RAG_MIN_SCORE = toNumber(process.env.RAG_MIN_SCORE, 0.4);

/** Peso da similaridade semântica na busca híbrida (o resto é sobreposição de palavras). */
export const RAG_SEMANTIC_WEIGHT = 0.7;

// ---------------------------------------------------------------------------
// Memória (seção 2)
// ---------------------------------------------------------------------------

/**
 * Tamanho da janela de contexto da memória de sessão, em TURNOS (um turno = 1
 * mensagem do usuário + 1 do assistente). Ao estourar, as mensagens mais
 * antigas saem da janela (truncagem deslizante).
 */
export const CONTEXT_WINDOW_TURNS = toNumber(process.env.CONTEXT_WINDOW_TURNS, 6);

// ---------------------------------------------------------------------------
// Arquivos (bancos locais em SQLite)
// ---------------------------------------------------------------------------

/** Pasta com os documentos da base de conhecimento (o corpus real). */
export const KB_DIR = "docs/base-de-conhecimento";

/** Banco vetorial: trechos + embeddings (gerado por `yarn ingest`). */
export const VECTOR_DB_PATH = process.env.VECTOR_DB_PATH ?? "vector_db.db";

/** Banco da memória persistente: fatos que sobrevivem entre sessões. */
export const MEMORY_DB_PATH = process.env.MEMORY_DB_PATH ?? "memory.db";

// ---------------------------------------------------------------------------
// Camada de regras (segurança)
// ---------------------------------------------------------------------------

/**
 * Guard-rail de credencial: barra a resposta que exponha o VALOR do segredo.
 * Os valores de desenvolvimento do repositório real são `admin/admin`, e a base
 * de conhecimento não os reproduz — então uma resposta correta nunca contém
 * `admin`. Checamos o valor, não as palavras "senha"/"password", para que uma
 * recusa legítima ("não revelo a senha do banco") continue válida.
 */
export const CREDENTIAL_PATTERN = /\badmin\b/i;
