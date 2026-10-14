# 01 · Arquitetura

Fonte: `coffee-delivery-api/build.gradle`; `coffee-delivery-api/src/main/java/...`; `coffee-delivery-frontend/package.json`

## Visão em duas aplicações
✅ O repositório tem duas aplicações independentes: a API (`coffee-delivery-api`) e o front-end (`coffee-delivery-frontend`). Elas ainda **não se comunicam**: o front-end não tem nenhuma chamada HTTP.

## Back-end
- ✅ Spring Boot 3.5.5, com Java 21 (definido pelo toolchain do Gradle).
- ✅ Gradle com wrapper na versão 8.14.3.
- ✅ Dependências principais: Spring Web, Spring Data JPA, Bean Validation (starter de validação), driver PostgreSQL e Lombok.
- ✅ O Spring Boot DevTools está presente apenas em desenvolvimento (`developmentOnly`).
- ✅ Testes com `spring-boot-starter-test` e JUnit Platform.

## Organização de pacotes (back-end)
Pacote raiz `com.wellington.coffee_delivery_api`:

| Pacote | Conteúdo |
|---|---|
| (raiz) | `CoffeeDeliveryApiApplication`, classe de inicialização |
| `config` | `CoffeeDataLoader`, que carrega o catálogo inicial |
| `controller` | `CoffeeController` |
| `entity` | `Coffee`, `Cart`, `CartItem`, `Order`, `OrderItem`, `Address` |
| `repository` | `CoffeeRepository`, `CartRepository`, `OrderRepository` |

## Camadas
- ✅ Existem controller, repository e entity.
- ❌ Não existe camada de serviço (`service`): o controller chama o repositório diretamente.
- ❌ Não existem DTOs: o endpoint devolve a própria entidade `Coffee`.
- ❌ Não há tratamento global de erros nem configuração de CORS.
- ⚠️ O starter de validação está nas dependências, mas nenhuma anotação de validação (`@Valid`, `@NotNull` etc.) é usada hoje.

## Front-end
- ✅ React 18, TypeScript 5, Vite 5 e styled-components 6.
- ✅ Gerenciador de pacotes: Yarn (existe `yarn.lock`).
- ❌ Não há biblioteca de rotas, de requisições HTTP nem de estado global.
