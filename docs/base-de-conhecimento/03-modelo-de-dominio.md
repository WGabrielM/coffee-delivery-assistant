# 03 · Modelo de domínio

Fonte: `coffee-delivery-api/src/main/java/com/wellington/coffee_delivery_api/entity/*.java`

## Entidades
✅ Todas as entidades usam UUID como identificador (gerado automaticamente) e Lombok (getters, setters, builder).

| Entidade | Tabela | Papel |
|---|---|---|
| `Coffee` | `coffees` | Um café do catálogo |
| `Cart` | `carts` | Carrinho de compras |
| `CartItem` | `cart_items` | Um café e sua quantidade dentro de um carrinho |
| `Order` | `orders` | Pedido finalizado |
| `OrderItem` | `order_items` | Uma linha do pedido |
| `Address` | (embutido em `orders`) | Endereço de entrega |

## Coffee
- Campos: `id`, `name` (obrigatório), `description` (opcional), `price` (obrigatório, precisão 10 e escala 2), `imageUrl` (opcional) e `tags` (lista de textos).
- As tags ficam em uma tabela própria, `coffee_tags`, com as colunas `coffee_id` e `tag`, e são carregadas junto com o café (fetch EAGER).

## Cart e CartItem
- `Cart` tem `id`, `createdAt` (não atualizável), `updatedAt` e a lista de `items`.
- `createdAt` e `updatedAt` são preenchidos automaticamente (na criação e na atualização).
- A relação com os itens é um-para-muitos, com cascade em todas as operações e remoção de órfãos.
- `CartItem` tem `id`, o `cart` (obrigatório, carregamento LAZY), o `coffee` (obrigatório, carregamento EAGER) e a `quantity` (obrigatória, inteiro).
- ⚠️ O carrinho **não está ligado a nenhum usuário**: não existe entidade de usuário no projeto.

## Order e OrderItem
- `Order` tem `id`, `createdAt` (preenchido na criação e não atualizável), `address`, `total`, `status` e a lista de `items`.
- `total` é obrigatório, com precisão 12 e escala 2.
- `status` é gravado como texto e começa em `PENDING`.
- `OrderItem` guarda `coffeeId` (um UUID simples, **sem** relacionamento JPA com `Coffee`), `coffeeName`, `price` e `quantity`, todos obrigatórios.
- ⚠️ O pedido **não tem ligação com o carrinho** nem com um usuário.

## Address
- Tipo embutido (`@Embeddable`): suas colunas ficam dentro da tabela `orders`, com prefixo `address_`.
- Campos obrigatórios: `zipCode` (até 9 caracteres), `street`, `number`, `neighborhood`, `city` e `state` (2 caracteres).
- Campo opcional: `complement`.
- Colunas na tabela: `address_zip_code`, `address_street`, `address_number`, `address_complement`, `address_neighborhood`, `address_city`, `address_state`.

## Relacionamentos em resumo
```
Cart 1 ──── N CartItem N ──── 1 Coffee
Order 1 ──── N OrderItem        (OrderItem guarda o id do café, sem relação JPA)
Order contém Address (embutido)
```
