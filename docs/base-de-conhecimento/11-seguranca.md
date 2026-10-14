# 11 · Segurança e segredos

Fonte: `coffee-delivery-api/docker-compose.yml`; `coffee-delivery-api/src/main/resources/application.properties`

## Credenciais do banco
- ⚠️ O usuário e a senha do PostgreSQL estão escritos diretamente em `application.properties` e em `docker-compose.yml`, em texto puro, e o repositório é público.
- São valores de desenvolvimento local. Os valores **não são reproduzidos nesta documentação** e o assistente não deve revelá-los.
- Recomendação: mover usuário e senha para variáveis de ambiente (ou um arquivo `.env` fora do controle de versão) e trocar as credenciais atuais.

## Autenticação e autorização
- ❌ Não existe login, usuário, token nem controle de acesso.
- Todos os endpoints são públicos, hoje apenas `GET /coffees`.

## Validação de entrada
- O starter de validação está nas dependências, mas nenhuma anotação de validação é usada.
- Não há validação do formato de CEP, de estado ou de quantidade.

## Dados pessoais
- O pedido guarda o endereço de entrega, que é dado pessoal. ❓ Ainda não há política de retenção nem de privacidade definida.

## Pagamento
- ❌ Não há dados de pagamento no projeto. ❓ Os dados de cartão, se existirem no futuro, devem ficar com o provedor de pagamento e não no banco da aplicação (recomendação, não decisão registrada).
