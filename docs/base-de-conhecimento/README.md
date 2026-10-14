# Coffee Delivery

Aplicação de entrega de café. O usuário escolhe o tipo de café, coloca no carrinho, paga e recebe a entrega.

> **Estado atual (leia primeiro):** o projeto está no início. Hoje existem o modelo de dados, um catálogo de 14 cafés carregado automaticamente e **um único endpoint** (`GET /coffees`). O carrinho, o pedido, o pagamento e o envio **ainda não foram implementados**. Cada documento indica o status de cada informação.

> **Idioma:** o idioma oficial do produto é o português.

## Legenda de status

| Marca | Significado |
|---|---|
| ✅ Implementado | Existe no código do repositório |
| 🟡 Planejado | É intenção do produto, mas ainda não existe no código |
| ❓ Indefinido | Ainda não foi decidido; não há regra no código nem no planejamento |

## Estrutura do repositório

- `coffee-delivery-api/`: back-end em Spring Boot (Java 21, Gradle, PostgreSQL)
- `coffee-delivery-frontend/`: front-end em React com TypeScript e Vite

## Índice dos documentos

| Doc | Assunto |
|---|---|
| [00-visao-geral](docs/00-visao-geral.md) | Objetivo do produto, fluxo desejado e estado atual |
| [01-arquitetura](docs/01-arquitetura.md) | Tecnologias, camadas e organização de pacotes |
| [02-como-rodar](docs/02-como-rodar.md) | Subir banco, API e front-end |
| [03-modelo-de-dominio](docs/03-modelo-de-dominio.md) | Entidades e relacionamentos |
| [04-api](docs/04-api.md) | Endpoints existentes e previstos |
| [05-catalogo-de-cafes](docs/05-catalogo-de-cafes.md) | Os 14 cafés, preços e tags |
| [06-carrinho-e-pedido](docs/06-carrinho-e-pedido.md) | Carrinho, pedido, status e endereço |
| [07-frontend](docs/07-frontend.md) | Telas, tema e componentes |
| [08-banco-e-configuracao](docs/08-banco-e-configuracao.md) | PostgreSQL, Docker e propriedades |
| [09-decisoes-tecnicas](docs/09-decisoes-tecnicas.md) | Decisões de projeto e seus motivos |
| [10-roadmap-e-lacunas](docs/10-roadmap-e-lacunas.md) | O que falta e o que está indefinido |
| [11-seguranca](docs/11-seguranca.md) | Segredos, credenciais e riscos conhecidos |
| [12-fluxo-de-compra](docs/12-fluxo-de-compra.md) | Telas de catálogo, checkout e confirmação (design) |

## Convenção das fontes

Cada documento começa com `Fonte:` listando os arquivos de onde a informação foi extraída. Caminhos são relativos à raiz do repositório.
