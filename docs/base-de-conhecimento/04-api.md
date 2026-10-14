# 04 · API

Fonte: `coffee-delivery-api/src/main/java/com/wellington/coffee_delivery_api/controller/CoffeeController.java`

## Endpoints existentes

| Método | Caminho | Status | Descrição |
|---|---|---|---|
| GET | `/coffees` | ✅ Implementado | Lista todos os cafés do catálogo |

## GET /coffees
- Resposta: status 200 com uma lista JSON de cafés.
- Cada café traz `id`, `name`, `description`, `price`, `imageUrl` e `tags`.
- ✅ Não há filtro, ordenação nem paginação: devolve tudo o que está no banco (`findAll`).
- ✅ Não exige autenticação (não existe autenticação no projeto).

## Endpoints que ainda não existem
- ❌ Buscar um café por id.
- ❌ Criar, alterar ou limpar carrinho.
- ❌ Criar ou consultar pedidos.
- ❌ Qualquer endpoint de pagamento ou de rastreio.

Os repositórios de carrinho e de pedido já existem, mas nenhum controller os usa.

## Convenções atuais
- Caminho base de cafés: `/coffees`.
- O controller devolve a entidade diretamente, sem DTO.
- Não há versionamento de API, documentação OpenAPI nem configuração de CORS.
