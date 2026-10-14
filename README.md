# Coffee Delivery Assistant

Assistente de conhecimento do projeto [Coffee Delivery](https://github.com/WGabrielM/coffee-delivery): uma plataforma de contexto AI-first que responde perguntas sobre o projeto usando **documentos reais**, com **memória**, uma **camada de regras** que controla o comportamento e um **pipeline RAG** sobre a base de conhecimento.

Capstone do Módulo 3 da pós-graduação em IA Aplicada (Coders University). Integra as quatro disciplinas do módulo: arquitetura (D1), contexto e memória (D2), RAG (D3) e decisão de customização (D4).

> **Comportamento central:** o assistente responde **somente** com o que está nos trechos recuperados, **recusa** o que não está na base, **cita a fonte** e segue um **formato JSON fixo**. É o mesmo contrato avaliado no experimento de fine-tuning (ver [`docs/decisao-customizacao.md`](docs/decisao-customizacao.md)).

## Requisitos

- **Node.js >= 22.18** (executa `.ts` direto, sem build, e usa `node:sqlite`)
- Uma chave da API da OpenAI (embeddings + geração)

## Instalação

```bash
npm install
cp .env.example .env.local      # edite e preencha OPENAI_API_KEY
```

## Uso

```bash
npm run ingest                  # lê a base, gera os trechos + embeddings (idempotente)
npm run ask "Quantos cafés tem no catálogo?"   # consulta única: mostra trechos + resposta
npm run demo                    # conversa de 3 turnos (memória + RAG + regras); grava o transcrito
npm run chat                    # chatbot no terminal, multi-turno
npm run eval                    # roda a avaliação e gera eval/relatorio.md
npm test                        # testes offline (não chamam a API)
npm run typecheck               # tsc --noEmit
```

Fluxo típico: `npm run ingest` → `npm run demo`.

## Estrutura

```
src/
  config.ts              parâmetros centralizados (modelos, RAG, janela de memória, regras)
  types.ts               tipos compartilhados (incl. o contrato de resposta)
  assistant.ts           orquestrador: pergunta → RAG → memória → regras → geração → validação
  ingest.ts              ingestão da base (npm run ingest)
  ask.ts                 consulta única com inspeção dos scores (npm run ask)
  demo.ts                demonstração de 3 turnos (npm run demo)
  cli.ts                 chatbot multi-turno (npm run chat)
  clients/openai.ts      cliente da OpenAI + retry + contagem de tokens
  rag/                   pipeline RAG: chunking, embedding, vector store, recuperação
  memory/                memória de sessão (janela) e persistente (entre sessões)
  rules/                 camada de regras: prompt de sistema + validação da saída
eval/                    conjunto de perguntas, juiz por LLM e gerador do relatório
docs/
  base-de-conhecimento/  o corpus real (13 documentos + índice)
  arquitetura.md         seção 1: componentes, fluxo e justificativas
  corpus.md              seção 3: origem, chunking e indexação da base
  decisao-customizacao.md seção 5: framework de decisão + evidência do fine-tuning
  demo-transcript.md     transcrito gerado por `npm run demo`
dataset/
  dataset.jsonl          dataset do experimento de fine-tuning, em JSONL (seção 5)
test/                    testes offline da lógica pura
```

## Como o projeto cobre a rubrica do capstone

| Seção da rubrica | Onde está |
|---|---|
| 1. Arquitetura | [`docs/arquitetura.md`](docs/arquitetura.md) + `src/assistant.ts` |
| 2. Contexto e memória | `src/memory/` (sessão e persistente) + `src/config.ts` (janela) |
| 3. Pipeline RAG | `src/rag/` + [`docs/corpus.md`](docs/corpus.md) |
| 4. Avaliação | `eval/` → `eval/relatorio.md` (gerado por `npm run eval`) |
| 5. Decisão de customização | [`docs/decisao-customizacao.md`](docs/decisao-customizacao.md) + `dataset/dataset.jsonl` |

## Notas de engenharia

- **Sem dependências pesadas:** o vector store e a memória persistente usam `node:sqlite` (nativo). A única dependência de runtime é o SDK da OpenAI.
- **Configuração em um lugar só:** todo valor ajustável está em `src/config.ts` e pode ser sobrescrito por `.env.local`.
- **Determinismo:** a geração usa temperatura baixa (0,1) e modo JSON, para o comportamento ser reproduzível.
- **Segurança:** a camada de regras barra o vazamento de credenciais; os valores de desenvolvimento do projeto real não aparecem na base nem nas respostas.

Licença: MIT. Autor: Wellington Gabriel Monteiro Batista.
