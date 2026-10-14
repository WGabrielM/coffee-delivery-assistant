# 06 · Carrinho, pedido, pagamento e endereço

Fonte: `coffee-delivery-api/src/main/java/.../entity/Cart.java`, `CartItem.java`, `Order.java`, `OrderItem.java`, `Address.java`; `.../repository/*.java`; design no Figma (checkout e confirmação)

> As telas que descrevem este fluxo estão em [12-fluxo-de-compra](12-fluxo-de-compra.md). O que está no design é 🟡 planejado; o que está no código é ✅.

## Carrinho
- ✅ Existem a entidade `Cart`, a entidade `CartItem` e o `CartRepository`.
- ❌ Não há endpoint nem regra de negócio de carrinho: não é possível adicionar, remover ou alterar itens pela API.
- 🟡 No design, o usuário ajusta a quantidade por item e pode remover um café do carrinho.
- ❓ Ainda não foi definido se o carrinho pertence a um usuário logado, a uma sessão ou fica no navegador.
- ❓ Ainda não há limite de quantidade por item.

## Pedido
- ✅ Existem a entidade `Order`, a entidade `OrderItem` e o `OrderRepository`.
- ❌ Não há endpoint para criar ou consultar pedidos.
- ✅ Um pedido novo nasce com o status `PENDING`.
- 🟡 No design, o pedido é criado ao clicar em "CONFIRMAR PEDIDO" no checkout.

## Status do pedido
Quatro status, definidos no enum `OrderStatus`:

| Status | Significado sugerido pelo nome |
|---|---|
| `PENDING` | Pendente (status inicial) |
| `CONFIRMED` | Confirmado |
| `DELIVERED` | Entregue |
| `CANCELLED` | Cancelado |

❓ O código não define quem muda o status, quando muda nem quais transições são permitidas. A tela de confirmação do design não menciona o status.

## Pagamento
- 🟡 **O pagamento é feito na entrega**, não on-line (texto do checkout e da confirmação no design).
- 🟡 Três formas de pagamento no design: **cartão de crédito**, **cartão de débito** e **dinheiro**.
- ❌ Não existe entidade, campo ou código de pagamento no projeto. A forma de pagamento escolhida não tem onde ser gravada hoje.
- ❓ Provedor de pagamento, troco (no caso de dinheiro) e regras de reembolso não foram definidos.

## Total e taxa de entrega
- ✅ O pedido tem o campo `total` (obrigatório).
- 🟡 No design, o valor a pagar é **total de itens + entrega**, e a tela mostra a taxa de entrega como uma linha separada.
- ❌ Não há, nas entidades, um campo específico para a taxa de entrega, e não existe código que calcule o total nem a taxa.
- ❓ O valor exato da taxa de entrega não é uma regra confirmada: o design mostra um valor de exemplo em uma tela.

## Entrega
- 🟡 A tela de confirmação mostra uma **previsão de entrega de 20 a 30 minutos**.
- ❓ Esse tempo é o que aparece no exemplo do design; não há regra no código, nem definição de áreas atendidas, prazo real ou rastreamento.

## Itens do pedido
- ✅ Cada `OrderItem` guarda o id do café, o nome do café, o preço e a quantidade.
- ✅ Nome e preço ficam gravados no próprio item (propósito confirmado pelo autor: preservar o valor da compra mesmo se o catálogo mudar).
- ❌ Ainda não existe código que copie esses dados do carrinho para o pedido.

## Endereço de entrega
- ✅ O endereço é guardado no pedido e exige CEP, rua, número, bairro, cidade e estado (sigla de 2 letras). O complemento é opcional.
- ✅ O CEP aceita até 9 caracteres, o que comporta o formato com hífen.
- 🟡 O formulário de endereço do design pede exatamente esses campos (CEP, Rua, Número, Complemento, Bairro, Cidade, UF), na mesma estrutura da entidade `Address`.
- ❌ Não há validação do formato do CEP nem consulta automática de endereço.
