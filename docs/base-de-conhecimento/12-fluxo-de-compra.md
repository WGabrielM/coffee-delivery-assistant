# 12 · Fluxo de compra (design)

Fonte: design no Figma — telas Home, Checkout (vazia e preenchida) e Success.

> ⚠️ **Tudo neste documento é 🟡 planejado (design).** São as telas desenhadas no Figma. **Nenhuma delas está implementada no código** hoje: não há tela de catálogo, carrinho, checkout nem confirmação, e não há endpoint de carrinho, pedido ou pagamento. Valores como a taxa de entrega e a previsão de tempo aparecem no design, mas **não existem no código** (não há, por exemplo, um campo de taxa de entrega nas entidades).

## Tela 1 — Catálogo (Home)
🟡 Lista os cafés em cartões. Cada cartão mostra: uma ou mais tags, o nome, a descrição, o preço em reais (R$ 9,90), um seletor de quantidade (− 1 +) e um botão para adicionar ao carrinho. No topo, o cabeçalho mostra a localização ("Porto Alegre, RS") e o ícone do carrinho com a contagem de itens.

## Tela 2 — Checkout
🟡 Dividida em duas colunas.

**Coluna esquerda — "Complete seu pedido":**
- **Endereço de Entrega** ("Informe o endereço onde deseja receber seu pedido"), com os campos: CEP, Rua, Número, Complemento (opcional), Bairro, Cidade e UF.
- **Pagamento** ("O pagamento é feito na entrega. Escolha a forma que deseja pagar"), com três opções: **Cartão de crédito**, **Cartão de débito** e **Dinheiro**.

**Coluna direita — "Cafés selecionados":**
- Cada café com imagem, nome, quantidade, preço e a opção **Remover**.
- **Total de itens** (soma dos cafés).
- **Entrega** (taxa de entrega).
- **Total** (itens + entrega).
- Botão **CONFIRMAR PEDIDO**.

## Tela 3 — Confirmação (Success)
🟡 "Uhu! Pedido confirmado" e "Agora é só aguardar que logo o café chegará até você". Mostra:
- O endereço de entrega informado.
- **Previsão de entrega: 20 min – 30 min**.
- **Pagamento na entrega**, com a forma escolhida (ex.: Cartão de Crédito).

## Regras de negócio que o design revela (planejado)
| Regra | Valor no design | No código |
|---|---|---|
| Moeda | Real (R$) | ❌ O preço é só um número, sem moeda |
| Pagamento | Feito **na entrega** (não on-line) | ❌ Não existe |
| Formas de pagamento | Cartão de crédito, cartão de débito, dinheiro | ❌ Não existe |
| Taxa de entrega | Cobrada (um valor fixo no exemplo do design) | ❌ Não há campo de taxa |
| Total | Total de itens + entrega | ❌ Não há cálculo |
| Previsão de entrega | 20 a 30 minutos | ❌ Não existe |
| Quantidade | Ajustável por item, com opção de remover | ❌ Não existe endpoint |

> Os valores numéricos de exemplo do design (preços, subtotal, taxa, total e o endereço mostrado) são **dados de exemplo de uma tela**, não regras garantidas. A taxa de entrega exata e a previsão de tempo não devem ser afirmadas como regra do produto sem confirmação do autor.

## Relação com o modelo de dados
🟡 Os campos do formulário de endereço do design (CEP, Rua, Número, Complemento, Bairro, Cidade, UF) correspondem um a um à entidade `Address` já existente no código (ver [03-modelo-de-dominio](03-modelo-de-dominio.md)). As três formas de pagamento e a taxa de entrega **não têm** campo correspondente nas entidades hoje.

## Idioma (design × código)
✅ O autor decidiu que o idioma oficial é o **português**, como no design (ex.: "Expresso Tradicional", "Café com Leite", "Cubano").
⚠️ O código ainda carrega os cafés **em inglês** (ex.: "Traditional Espresso", "Coffee with Milk", "Cuban") e as tags em inglês (`traditional`, `with milk`, `alcoholic`). Traduzir o catálogo é uma pendência de implementação. A correspondência entre os nomes está em [05-catalogo-de-cafes](05-catalogo-de-cafes.md).
