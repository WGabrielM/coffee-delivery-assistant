# Relatório de avaliação — Assistente do Coffee Delivery

Gerado por `yarn eval`. Conjunto: 15 perguntas em 11 conversas.

## Métricas por dimensão

| Dimensão | Resultado |
|---|---|
| Decisão na_base correta | 92.9% (13/14) |
| Relevância da recuperação (trecho certo no top-k) | 83.3% (10/12) |
| Fidelidade média (0–2) | 1.93 |
| Coerência do histórico média (0–2, follow-ups) | 1.50 |
| Contrato de formato válido | 100.0% (15/15) |
| Regras respeitadas (validação) | 100.0% (15/15) |

Custo da execução: 53 chamadas à API, 26174 tokens de entrada, 924 de saída.

## Nota por pergunta

| Conversa·Turno | Tipo | na_base (esp→obt) | Decisão | Recuperação | Fidelidade | Coerência |
|---|---|---|---|---|---|---|
| MEM-1·1 | respondivel | sim→sim | ok | não | 1 | — |
| MEM-1·2 | follow_up_memoria | sim→sim | ok | sim | 2 | 2 |
| MEM-1·3 | follow_up_memoria | sim→não | ERRO | sim | 2 | 0 |
| MEM-2·1 | respondivel | sim→sim | ok | sim | 2 | — |
| MEM-2·2 | follow_up_memoria | sim→sim | ok | sim | 2 | 2 |
| MEM-3·1 | respondivel | sim→sim | ok | não | 2 | — |
| MEM-3·2 | follow_up_memoria | sim→sim | ok | sim | 2 | 2 |
| S1·1 | respondivel | sim→sim | ok | sim | 2 | — |
| S2·1 | respondivel | sim→sim | ok | sim | 2 | — |
| S3·1 | ausencia_documentada | sim→sim | ok | sim | 2 | — |
| S4·1 | fora_da_base | não→não | ok | — | 2 | — |
| S5·1 | fora_da_base | não→não | ok | — | 2 | — |
| S6·1 | confidencial | sim→sim | ok | sim | 2 | — |
| S7·1 | ambigua | não→sim | — | — | 2 | — |
| S8·1 | respondivel | sim→sim | ok | sim | 2 | — |

## Análise de falhas

- **MEM-1·1** (Quais cafés o catálogo tem?): trecho esperado não foi recuperado (falha de retrieval); fidelidade 1 (geração).
- **MEM-1·3** (E dá para pagar esses pedidos com cartão online?): decisão na_base errada; ignorou o histórico (memória).
- **MEM-3·1** (O projeto tem uma tela de checkout?): trecho esperado não foi recuperado (falha de retrieval).
