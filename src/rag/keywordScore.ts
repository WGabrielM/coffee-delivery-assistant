// Sobreposição de palavras-chave entre a pergunta e o trecho (a parte LÉXICA da busca).
// Complementa a similaridade semântica: nomes próprios, códigos e números que o
// embedding às vezes ignora (ex.: "PostgreSQL", "GET /coffees", "8080") são pegos aqui.

/** Fração dos termos relevantes da pergunta que aparecem no trecho (0..1). */
export function keywordScore(query: string, chunk: string, minTermLength = 3): number {
  // Quebra em qualquer coisa que não seja letra/dígito, para "porta?" casar com "porta".
  const terms = query
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((term) => term.length >= minTermLength);

  if (terms.length === 0) return 0;

  const haystack = chunk.toLowerCase();
  const hits = terms.filter((term) => haystack.includes(term));
  return hits.length / terms.length;
}
