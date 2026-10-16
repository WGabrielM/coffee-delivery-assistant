# Transcrito da demonstração — 3 turnos

Gerado por `yarn demo`. A conversa exercita memória de sessão, recuperação (RAG) e a camada de regras.

## Turno 1

**Pergunta:** Quais cafés o catálogo tem?

**Resposta:** O catálogo tem 14 cafés: Expresso Tradicional, Expresso Americano, Expresso Cremoso, Expresso Gelado, Café com Leite, Latte, Capuccino, Macchiato, Mocaccino, Chocolate Quente, Cubano, Havaiano, Árabe e Irlandês.

- `na_base`: true
- Fonte citada: `00-visao-geral#Estado atual do projeto (código)`, `05-catalogo-de-cafes#Tags`
- Trechos recuperados: `05-catalogo-de-cafes#Como o catálogo é carregado` (0.72), `00-visao-geral#Estado atual do projeto (código)` (0.66), `05-catalogo-de-cafes#Tags` (0.64), `README#Introdução` (0.64), `05-catalogo-de-cafes#Atualização do catálogo` (0.63)
- Validação: ok

## Turno 2

**Pergunta:** Quanto custa cada um deles?

**Resposta:** Cada um dos 14 cafés custa R$ 9,90.

- `na_base`: true
- Fonte citada: `05-catalogo-de-cafes#Preços`
- Trechos recuperados: `05-catalogo-de-cafes#Preços` (0.62), `12-fluxo-de-compra#Tela 1 — Catálogo (Home)` (0.62), `05-catalogo-de-cafes#Atualização do catálogo` (0.60), `00-visao-geral#Fluxo desejado, passo a passo` (0.55), `05-catalogo-de-cafes#Os 14 cafés` (0.55)
- Validação: ok

## Turno 3

**Pergunta:** E dá para pagar esses pedidos com cartão online?

**Resposta:** A informação não consta na base de conhecimento.

- `na_base`: false
- Fonte citada: —
- Trechos recuperados: `12-fluxo-de-compra#Tela 2 — Checkout` (0.47), `06-carrinho-e-pedido#Pagamento` (0.46), `11-seguranca#Pagamento` (0.46), `06-carrinho-e-pedido#Pedido` (0.44), `12-fluxo-de-compra#Tela 3 — Confirmação (Success)` (0.42)
- Validação: ok

## O que esta conversa demonstra

- **Memória de sessão:** os turnos 2 e 3 não repetem "cafés"/"pedidos" — o assistente entende a referência pelo histórico.
- **Recuperação (RAG):** cada turno busca os trechos relevantes à pergunta, não a base inteira.
- **Camada de regras:** o turno 3 responde com `na_base: true` e fonte mesmo o recurso não existindo, porque a base documenta a ausência.
