# Seção 3 — Corpus e pipeline RAG

## Origem do corpus

A base de conhecimento (`docs/base-de-conhecimento/`) descreve o projeto real **Coffee Delivery** ([WGabrielM/coffee-delivery](https://github.com/WGabrielM/coffee-delivery)), uma API Spring Boot com front-end React, ainda no início. São **13 documentos** mais um índice (`README.md`), escritos em português a partir de três fontes, declaradas no topo de cada documento:

- o **código** dos dois repositórios (`coffee-delivery-api`, `coffee-delivery-frontend`);
- o **design no Figma** (telas Home, Checkout e Success);
- a **descrição do produto** pelo autor.

Cada afirmação carrega um status: ✅ implementado, 🟡 planejado (design) ou ❓ indefinido. Isso é essencial para o assistente distinguir "existe no código" de "existe só no design", e é o que sustenta as respostas de **ausência documentada** (algo que a base diz que ainda não existe).

Os documentos cobrem: visão geral, arquitetura, como rodar, modelo de domínio, API, catálogo de cafés, carrinho e pedido, front-end, banco e configuração, decisões técnicas, roadmap e lacunas, segurança e fluxo de compra.

## Estratégia de indexação

| Etapa | Decisão tomada | Parâmetros |
|---|---|---|
| Chunking | Uma seção `##` do Markdown = um trecho | id = `arquivo#seção` (ex.: `05-catalogo-de-cafes#Preços`) |
| Unidade semântica | Seção escrita por quem conhece o projeto | 78 trechos no total; ~1.000–1.200 caracteres em média |
| Modelo de embedding | `text-embedding-3-small` (OpenAI) | 1536 dimensões |
| Vector store | `node:sqlite` (arquivo `vector_db.db`) | um registro por trecho: id, documento, texto, embedding |
| Idempotência | `INSERT ... ON CONFLICT DO UPDATE` por id | re-ingerir não duplica |

**Por que seção, e não janela de N caracteres:** as seções já são unidades de sentido, e o título da seção vira um identificador natural para a citação da fonte. O mesmo esquema de 78 trechos é usado no experimento de fine-tuning, o que mantem os dois trabalhos consistentes.

## Estratégia de recuperação

| Etapa | Decisão tomada | Parâmetros |
|---|---|---|
| Similaridade | Busca híbrida: semântica + léxica | `score = 0,7·cosseno + 0,3·palavra-chave` |
| Quantidade | Top-k por pontuação | `RAG_TOP_K = 5` |
| Limiar de relevância | Descarta trechos de score baixo | `RAG_MIN_SCORE = 0,4` |
| Calibração | Olhar os scores reais | `npm run ask "..."` imprime id + score |

**Por que híbrida:** nomes próprios, códigos e números (ex.: `GET /coffees`, `PostgreSQL`, `8080`) nem sempre entram bem no embedding; a sobreposição de palavras-chave recupera esses casos. O peso de 0,7 para a parte semântica é um ponto de partida, calibrável por `RAG_SEMANTIC_WEIGHT`.

## Integração ao prompt (sem estourar a janela)

Os trechos recuperados entram na **camada de usuário**, dentro de `<contexto>`, separados por `---`, e a pergunta dentro de `<pergunta>`. As regras ficam na **camada de sistema**. Marcas de camada que apareçam no conteúdo são removidas, para um documento ou a pergunta não "fecharem" a camada antes da hora. Como só os `RAG_TOP_K` trechos acima do limiar entram, o contexto por pergunta fica em torno de alguns milhares de caracteres — bem dentro da janela do modelo, deixando espaço para o histórico da conversa.
