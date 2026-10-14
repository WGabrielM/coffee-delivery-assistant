# 00 · Visão geral

Fonte: descrição do produto pelo autor; design no Figma (capturas das telas Home, Checkout e Success); `coffee-delivery-api/`; `coffee-delivery-frontend/`

## Objetivo do produto
🟡 O Coffee Delivery é um produto que entrega café de acordo com o que o usuário quer. O fluxo desejado é: o usuário seleciona o tipo de café, coloca no carrinho, informa o endereço, escolhe a forma de pagamento e recebe a entrega.

## Fluxo desejado, passo a passo
1. 🟡 Escolher o café no catálogo (Home) e definir a quantidade.
2. 🟡 Colocar os cafés no carrinho.
3. 🟡 No checkout, informar o endereço de entrega.
4. 🟡 Escolher a forma de pagamento (o pagamento é feito na entrega).
5. 🟡 Confirmar o pedido.
6. 🟡 Acompanhar a confirmação, com a previsão de entrega.

Detalhes de cada tela estão em [12-fluxo-de-compra](12-fluxo-de-compra.md).

## Mensagens do produto (Home, design)
🟡 A tela inicial traz o título "Encontre o café perfeito para qualquer hora do dia" e o texto "Com o Coffee Delivery você recebe seu café onde estiver, a qualquer hora". Abaixo, quatro benefícios:
- Compra simples e segura
- Embalagem mantém o café intacto
- Entrega rápida e rastreada
- O café chega fresquinho até você

> Observação: "entrega rastreada" é uma promessa de marketing do design. Não há rastreamento no código nem detalhamento de como funcionaria.

## Estado atual do projeto (código)
- ✅ Existe o catálogo de 14 cafés, carregado no banco na primeira execução da API.
- ✅ Existe o endpoint `GET /coffees`, que devolve o catálogo.
- ✅ Existem as entidades de carrinho, item do carrinho, pedido, item do pedido e endereço.
- ❌ Não existem endpoints de carrinho, de pedido nem de pagamento.
- ❌ As telas de catálogo, carrinho, checkout e confirmação **estão no design, mas não foram construídas**. No código, só o cabeçalho existe; a Home mostra apenas o texto "Home".

## Uso de IA no produto
🟡 O autor pretende adicionar IA ao produto por vários métodos, começando pelos mais simples. Nenhum recurso de IA existe no código hoje. Os métodos específicos ainda não foram definidos (❓).

## Nome e identificação
- Nome do produto: Coffee Delivery (título da página HTML e nome do projeto).
- Nome do módulo de back-end: `coffee-delivery-api`.
- Pacote Java raiz: `com.wellington.coffee_delivery_api`.
