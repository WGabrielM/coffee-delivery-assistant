// Similaridade de cosseno entre dois vetores (a parte SEMÂNTICA da busca).
// Mede o ângulo entre os embeddings: 1 = mesma direção, 0 = ortogonais.

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;

  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  if (magA === 0 || magB === 0) return 0; // evita divisão por zero (NaN)
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}
