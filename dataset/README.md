# Dataset do experimento de fine-tuning

Evidência da seção 5 ([`docs/decisao-customizacao.md`](../docs/decisao-customizacao.md)). É o mesmo contrato do assistente (responder só com o contexto, recusar fora da base, citar a fonte, formato JSON), usado para treinar e avaliar um modelo pequeno (Qwen2.5-1.5B, QLoRA) no experimento à parte.

## Arquivos

| Arquivo | Conteúdo |
|---|---|
| `dataset.jsonl` | 182 exemplos no formato de chat (`messages`: system → user com contexto+pergunta → assistant com a resposta ideal) |
| `dataset.train.jsonl` | 130 exemplos de treino (`train` + `train2`) |
| `dataset.test.jsonl` | 52 exemplos de teste (`test` + `test2`) |
| `dataset.parquet` | os 182 exemplos com todos os metadados (categoria, fato, fontes, origem, revisão) |

## Formato de cada linha do JSONL

```json
{"messages": [
  {"role": "system", "content": "<contrato de regras>"},
  {"role": "user", "content": "<contexto>...\n</contexto>\n\n<pergunta>...\n</pergunta>"},
  {"role": "assistant", "content": "{\"na_base\": true, \"resposta\": \"...\", \"fonte\": [\"...\"]}"}
]}
```

## Origem e composição

Os exemplos são **sintéticos**, gerados a partir da base de conhecimento (os mesmos 78 trechos que o RAG indexa) e revisados pelo autor. Cobrem nove categorias: resposta direta, combinação de trechos, base silenciosa, ausência documentada, confidencial, ambígua, distratores, fora do domínio e contexto contrafactual. Cerca de 40% dos exemplos de treino não têm resposta na base, para ensinar a recusa. Os conjuntos de teste usam fatos que não aparecem no treino.

> Dataset pequeno e de domínio estreito: os resultados mostram o comportamento **neste domínio**, não uma melhoria geral do modelo.
