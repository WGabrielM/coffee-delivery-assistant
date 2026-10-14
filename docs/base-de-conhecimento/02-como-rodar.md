# 02 · Como rodar o projeto

Fonte: `coffee-delivery-api/docker-compose.yml`; `coffee-delivery-api/gradle/wrapper/gradle-wrapper.properties`; `coffee-delivery-frontend/package.json`

## Pré-requisitos
- Java 21
- Docker (para o PostgreSQL)
- Node.js e Yarn (para o front-end)

## Banco de dados
Dentro de `coffee-delivery-api/`:
```bash
docker compose up -d
```
✅ Sobe um PostgreSQL 16 (imagem `postgres:16-alpine`) em um container chamado `coffee_delivery_postgres`, na porta 5432, com o banco `coffee_delivery`. Os dados ficam em um volume chamado `postgres_data`.

## API
Dentro de `coffee-delivery-api/`, com o banco ativo:
```bash
./gradlew bootRun
```
- ✅ Na primeira execução, a API cria as tabelas automaticamente e carrega os 14 cafés do catálogo.
- ✅ A porta do servidor não é configurada no projeto, então vale o padrão do Spring Boot (8080).
- Teste rápido: `GET /coffees`.

## Front-end
Dentro de `coffee-delivery-frontend/`:
```bash
yarn
yarn dev
```
Scripts disponíveis: `dev` (servidor de desenvolvimento), `build` (executa `tsc -b` e depois `vite build`), `lint` (ESLint) e `preview`.

## Testes
- ✅ Existe um único teste no back-end, `contextLoads`, que apenas verifica se o contexto do Spring sobe.
- ⚠️ Como não há configuração de banco para teste, esse teste tende a exigir o PostgreSQL ativo.
- ❌ Não há testes no front-end.
