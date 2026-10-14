# 08 · Banco de dados e configuração

Fonte: `coffee-delivery-api/docker-compose.yml`; `coffee-delivery-api/src/main/resources/application.properties`

## Banco
- ✅ PostgreSQL 16 (imagem `postgres:16-alpine`), executado com Docker Compose.
- ✅ Container: `coffee_delivery_postgres`. Banco: `coffee_delivery`. Porta: 5432 (mapeada para a mesma porta na máquina).
- ✅ Os dados persistem no volume `postgres_data`.
- ✅ Há um healthcheck que roda `pg_isready` a cada 30 segundos, com limite de 10 segundos e 3 tentativas.

## Propriedades da aplicação
- Nome da aplicação: `coffee-delivery-api`.
- A URL do banco é `jdbc:postgresql://localhost:5432/coffee_delivery`, coerente com o Docker Compose.
- `spring.jpa.hibernate.ddl-auto=update`: o Hibernate cria e atualiza as tabelas automaticamente.
- `spring.jpa.show-sql=true` e `format_sql=true`: os comandos SQL aparecem formatados no log.
- `spring.jpa.open-in-view=false`: desligado, o que evita que consultas ao banco ocorram fora da camada de dados (motivo confirmado pelo autor).

## Tabelas geradas
`coffees`, `coffee_tags`, `carts`, `cart_items`, `orders` e `order_items`. O endereço não tem tabela própria: está nas colunas `address_*` de `orders`.

## Configuração por ambiente
- ❌ Não há perfis de ambiente (desenvolvimento, teste, produção) nem arquivos de propriedades separados.
- ❌ Não há migrações de banco (Flyway ou Liquibase): o esquema depende do `ddl-auto=update`.
- Credenciais do banco: veja [11-seguranca](11-seguranca.md).
