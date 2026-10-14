// Tipos centrais compartilhados entre as camadas (RAG, memória, regras, orquestração).

/** Uma mensagem da conversa, no formato esperado pela API de chat. */
export type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

/**
 * Um trecho da base de conhecimento.
 * O `id` segue o padrão `arquivo#seção` (ex.: `05-catalogo-de-cafes#Preços`)
 * e é o que o assistente cita no campo `fonte`.
 */
export type Chunk = {
  id: string;
  documento: string;
  secao: string;
  texto: string;
};

/** Um trecho recuperado pela busca, com a pontuação de relevância (0..1). */
export type RetrievedChunk = {
  id: string;
  texto: string;
  score: number;
};

/**
 * O contrato de saída do assistente (a "camada de regras").
 * O modelo é obrigado a responder SEMPRE neste formato JSON.
 */
export type AssistantAnswer = {
  /** A informação pedida consta na base de conhecimento? */
  na_base: boolean;
  /** A resposta em português, baseada apenas no contexto. */
  resposta: string;
  /** Ids dos trechos que sustentam a resposta (vazio quando `na_base` é false). */
  fonte: string[];
};

/** Resultado de validação de uma estrutura (saída do modelo, por exemplo). */
export type ValidationResult = {
  isValid: boolean;
  errors: string[];
};

/** Tudo o que uma pergunta produz: resposta, trechos usados, texto cru e validação. */
export type AssistantResult = {
  answer: AssistantAnswer;
  retrieved: RetrievedChunk[];
  raw: string;
  validation: ValidationResult;
};
