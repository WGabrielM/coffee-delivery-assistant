# 09 · Decisões técnicas

Fonte: código-fonte do back-end e do front-end; os motivos foram **confirmados pelo autor em 12/10/2026**.

## Decisões

| # | Decisão | Onde aparece | Motivo |
|---|---|---|---|
| 1 | Identificadores UUID gerados automaticamente | Todas as entidades | Ids não sequenciais, difíceis de adivinhar |
| 2 | Preço como `BigDecimal` com escala 2 | `Coffee`, `OrderItem`, `Order` | Evitar erros de arredondamento com dinheiro |
| 3 | Nome e preço copiados no `OrderItem` | `OrderItem` | Preservar o valor do pedido se o catálogo mudar |
| 4 | `Address` como tipo embutido | `Order` | Endereço pertence ao pedido e não tem vida própria |
| 5 | Tags em tabela própria (`coffee_tags`) | `Coffee` | Lista simples de textos sem criar uma entidade nova |
| 6 | Carga inicial do catálogo idempotente | `CoffeeDataLoader` | Rodar a API várias vezes sem duplicar cafés |
| 7 | Carga inicial desligada no perfil `test` | `@Profile("!test")` | Não popular dados durante os testes |
| 8 | `open-in-view=false` | `application.properties` | Evitar acesso preguiçoso ao banco fora da transação |
| 9 | `ddl-auto=update` | `application.properties` | Praticidade na fase inicial, sem migrações |
| 10 | Banco em Docker Compose | `docker-compose.yml` | Ambiente local reproduzível |
| 11 | Estilos com styled-components e tema | Front-end | Cores centralizadas em um tema |

## Pontos a revisar
- `CartItem.coffee` usa carregamento EAGER e `OrderItem.order` usa LAZY; a escolha para o carrinho não está justificada no código.
- O `ddl-auto=update` costuma ser trocado por migrações antes de produção.
- Não há camada de serviço: regras de negócio futuras (total do pedido, transições de status) precisarão de um lugar definido.
