# Seção 5 — Decisão de customização

## O framework de decisão

A ordem de customização vai do mais barato ao mais caro: **prompt engineering → RAG → fine-tuning**. Só se sobe um degrau quando o anterior não resolve. Este projeto já aplica os dois primeiros:

- **Prompt engineering:** a camada de regras (`src/rules/systemPrompt.ts`) impõe o contrato — responder só com o contexto, recusar fora da base, citar a fonte, formato JSON.
- **RAG:** a base real entra como contexto por pergunta (`src/rag/`), fornecendo os fatos.
- **Validação determinística:** `src/rules/validateAnswer.ts` é uma rede de segurança que barra fonte inválida, incoerência de `na_base` e vazamento de credencial, independente do modelo.

A pergunta da D4 é: **vale subir para o fine-tuning?** Para responder com evidência, e não com opinião, o fine-tuning foi de fato implementado e medido em um experimento à parte (o micro-capstone), cujo dataset acompanha este repositório em [`dataset/dataset.jsonl`](../dataset/dataset.jsonl) (182 exemplos).

## A evidência do experimento

O experimento ajustou um modelo pequeno local (Qwen2.5-1.5B em 4 bits, QLoRA) sobre o mesmo contrato e a mesma base. Comparação em um teste cego de 24 casos (12 com resposta, 12 sem), geração determinística:

| Métrica (teste cego) | Base + contexto (RAG + prompt) | QLoRA (fine-tuned) |
|---|---|---|
| Formato JSON estrito | 0,0% | 100,0% |
| Decisão na_base correta (estrita) | 25,0% | 87,5% |
| Recusa correta nos casos sem resposta (tolerante ao formato) | 50,0% | 75,0% |
| Fonte válida | 25,0% | 95,8% |
| Fonte correta | 12,5% | 70,8% |

A diferença de recusa (9 de 12 contra 2–3 de 12 nos braços sem o ajuste da rodada 2) tem significância limítrofe no teste exato de Fisher (p ≈ 0,012 a 0,039), com a ressalva de n = 12 por grupo: é tendência clara, não prova. Custo do ajuste: 637 s de treino, pico de 3,5 GB de VRAM, adaptador de 74 MB.

**Leitura central:** o fine-tuning trouxe ganho real de **controle de comportamento** (formato e recusa), não de fatos — os fatos continuam vindo do contexto. O limite também apareceu: fatos novos entram por RAG, não por retreino.

## A decisão deste sistema

O experimento ajustou um modelo **pequeno e local** porque era o que cabia na T4 gratuita. O ponto decisivo é que o maior ganho do fine-tuning — levar o formato JSON de 0% para 100% — corrige uma fraqueza **do modelo de 1,5 B**, não do RAG. Este sistema roda sobre um modelo comercial (`gpt-4o-mini`), que **já** segue o formato e as instruções, e ainda tem a validação determinística como rede.

Por isso, para o **volume atual**, a recomendação é **prompt + RAG + validação**, sem fine-tuning:

1. O modelo comercial cobre o formato e boa parte da recusa que o fine-tuning teve de ensinar ao modelo pequeno.
2. A camada de validação garante as regras de forma determinística, não probabilística.
3. Manter um modelo próprio ajustado traz custo operacional (hospedagem, VRAM, re-treino quando a base muda) que o volume atual não justifica.

## O que mudaria com 10x o volume

| Fator | Hoje (prompt + RAG) | Com 10x o volume |
|---|---|---|
| Custo | Por chamada ao provedor; irrelevante em baixo volume | Domina; um modelo pequeno ajustado próprio pode ficar mais barato por chamada |
| Controle de comportamento | Modelo comercial + validação | Fine-tuning passa a compensar: o experimento mostrou recusa de 16,7% → 75% e formato 100% no modelo pequeno |
| Dependência e latência | Depende do provedor | Modelo próprio reduz dependência, latência e exposição de dados |
| Manutenção | Editar a base (RAG) | Re-treinar quando o **comportamento** muda; os **fatos** continuam no RAG |

Em 10x, a decisão se inverte para um cenário plausível: **self-hosting de um modelo pequeno ajustado** (para custo e controle), mantendo o RAG para os fatos. O experimento já é a evidência de que esse ajuste entrega o comportamento desejado no modelo pequeno.

## Resumo

- Agora: **prompt + RAG + validação** sobre modelo comercial — suficiente e mais barato de manter.
- O fine-tuning foi implementado, medido e mostrou ganho de controle, mas sobre um modelo que este sistema não usa em produção.
- O gatilho para adotá-lo é o **volume (10x)**, quando custo e independência justificam hospedar um modelo próprio ajustado.
