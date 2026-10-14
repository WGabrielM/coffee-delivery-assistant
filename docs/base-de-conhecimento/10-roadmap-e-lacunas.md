# 10 · Roadmap e lacunas

Fonte: descrição do produto pelo autor; design no Figma; análise do código

## O que o produto pretende ter (planejado)
1. Catálogo de cafés com seleção de quantidade.
2. Carrinho com ajuste de quantidade e remoção de itens.
3. Checkout com endereço de entrega.
4. Pagamento **na entrega**, em cartão de crédito, cartão de débito ou dinheiro.
5. Confirmação do pedido com previsão de entrega (20 a 30 minutos no design).
6. Taxa de entrega somada ao total.
7. Recursos de IA, começando pelos métodos mais simples (sem definição de qual).

## O que já está pronto (implementado)
- Modelo de dados de catálogo, carrinho, pedido e endereço.
- Catálogo inicial com 14 cafés.
- Endpoint `GET /coffees`.
- Cabeçalho do front-end.

## O que falta para o fluxo funcionar
- Construir as telas desenhadas: catálogo, carrinho, checkout e confirmação.
- Chamadas do front-end à API e configuração de CORS.
- Endpoints de carrinho e de pedido.
- Modelo e código de pagamento (forma de pagamento, pagamento na entrega).
- Campo e cálculo da taxa de entrega e do total.
- Cópia dos dados do carrinho para o pedido.
- Imagens dos cafés (caminhos `/coffees/*.png` sem arquivos).
- Traduzir o catálogo do código para o português (idioma oficial decidido pelo autor; os dados ainda estão em inglês).

## Decisões ainda em aberto
- Valor exato da taxa de entrega e previsão real de tempo (o design mostra exemplos).
- Troco para pagamento em dinheiro e provedor para os cartões.
- Áreas atendidas e rastreamento (o hero promete "entrega rastreada", sem detalhe).
- Usuários e login (carrinho e pedido ainda não pertencem a ninguém).
- Regras de cancelamento e transições de status do pedido.
- Quais recursos de IA serão implementados.
- Estratégia de testes além do `contextLoads`.
- Ambiente de produção e hospedagem.

## Como o assistente deve tratar o que está em aberto
Para qualquer item ❓ ou ❌, a resposta correta é dizer que a informação não consta na base de conhecimento (ou que é apenas intenção de design, ainda não implementada) e indicar o que existe hoje, sem inventar regras. Em especial, o assistente **não deve afirmar como certo** um valor que aparece só como exemplo em uma tela (taxa de entrega, tempo de entrega, endereço mostrado).
