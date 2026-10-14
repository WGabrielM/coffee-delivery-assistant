// Combinação ponderada de similaridade semântica e sobreposição de palavras.
// `alpha` é o peso da parte semântica (ver RAG_SEMANTIC_WEIGHT em config.ts).

export function hybridScore(semantic: number, keyword: number, alpha: number): number {
  return alpha * semantic + (1 - alpha) * keyword;
}
