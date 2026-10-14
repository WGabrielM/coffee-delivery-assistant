# 05 · Catálogo de cafés

Fonte: `coffee-delivery-api/src/main/java/com/wellington/coffee_delivery_api/config/CoffeeDataLoader.java`

## Como o catálogo é carregado
✅ Ao iniciar a API (exceto com o perfil `test`), o `CoffeeDataLoader` verifica se já existem cafés no banco. Se existirem, não faz nada (registra "Coffee catalog already seeded, skipping."). Se o banco estiver vazio, grava os 14 cafés abaixo.

## Os 14 cafés

| Café (português, como no design) | Nome no código (inglês) | Descrição (português, tradução da descrição do código) | Tags (português) | Tags no código (inglês) | Preço | Imagem |
|---|---|---|---|---|---|---|
| Expresso Tradicional | Traditional Espresso | O tradicional café feito com água quente e grãos moídos | tradicional | traditional | 9.90 | `/coffees/expresso.png` |
| Expresso Americano | Americano | Expresso diluído, menos intenso que o tradicional | tradicional | traditional | 9.90 | `/coffees/americano.png` |
| Expresso Cremoso | Creamy Espresso | Expresso tradicional com espuma cremosa | tradicional | traditional | 9.90 | `/coffees/expresso-cremoso.png` |
| Expresso Gelado | Iced Espresso | Bebida preparada com expresso e cubos de gelo | tradicional, gelado | traditional, iced | 9.90 | `/coffees/cafe-gelado.png` |
| Café com Leite | Coffee with Milk | Metade expresso tradicional, metade leite vaporizado | tradicional, com leite | traditional, with milk | 9.90 | `/coffees/cafe-com-leite.png` |
| Latte | Latte | Uma dose de expresso com o dobro de leite e espuma cremosa | tradicional, com leite | traditional, with milk | 9.90 | `/coffees/latte.png` |
| Capuccino | Cappuccino | Bebida com canela feita de doses iguais de café, leite e espuma | tradicional, com leite | traditional, with milk | 9.90 | `/coffees/capuccino.png` |
| Macchiato | Macchiato | Expresso misturado com um pouco de leite quente e espuma | tradicional, com leite | traditional, with milk | 9.90 | `/coffees/macchiato.png` |
| Mocaccino | Mochaccino | Expresso com calda de chocolate, um pouco de leite e espuma | tradicional, com leite | traditional, with milk | 9.90 | `/coffees/mocaccino.png` |
| Chocolate Quente | Hot Chocolate | Bebida feita com chocolate dissolvido no leite quente e café | especial, com leite | special, with milk | 9.90 | `/coffees/chocolate-quente.png` |
| Cubano | Cuban | Bebida gelada de expresso com rum, creme de leite e hortelã | especial, alcoólico, gelado | special, alcoholic, iced | 9.90 | `/coffees/cubano.png` |
| Havaiano | Hawaiian | Bebida adocicada preparada com café e leite de coco | especial | special | 9.90 | `/coffees/havaiano.png` |
| Árabe | Arabic | Bebida preparada com grãos de café árabe e especiarias | especial | special | 9.90 | `/coffees/arabe.png` |
| Irlandês | Irish | Bebida à base de café, uísque irlandês, açúcar e chantilly | especial, alcoólico | special, alcoholic | 9.90 | `/coffees/irlandes.png` |

## Preços
✅ Todos os 14 cafés custam 9.90 (valor numérico). O código **não define a moeda** do preço. Como todos têm o mesmo valor, não existe um café mais caro nem mais barato que os outros.

## Tags
As tags classificam os cafés. No código elas são `traditional`, `special`, `with milk`, `iced` e `alcoholic` (em português: tradicional, especial, com leite, gelado e alcoólico):

- tradicional (`traditional`), 9 cafés: Expresso Tradicional, Expresso Americano, Expresso Cremoso, Expresso Gelado, Café com Leite, Latte, Capuccino, Macchiato, Mocaccino
- especial (`special`), 5 cafés: Chocolate Quente, Cubano, Havaiano, Árabe, Irlandês
- com leite (`with milk`), 6 cafés: Café com Leite, Latte, Capuccino, Macchiato, Mocaccino, Chocolate Quente
- gelado (`iced`), 2 cafés: Expresso Gelado, Cubano
- alcoólico (`alcoholic`), 2 cafés: Cubano, Irlandês

Total: 14 cafés. Cada café tem de uma a três tags.

## Cafés alcoólicos
✅ Dois cafés têm a tag `alcoholic` (alcoólico): Cubano (leva rum) e Irlandês (leva uísque irlandês), segundo suas descrições.

## Imagens
⚠️ Cada café aponta para uma imagem em `/coffees/<nome>.png`, mas a pasta `public/` do front-end contém apenas `vite.svg`. **As imagens dos cafés não estão no repositório**.

## Idioma
✅ **Decisão do autor: o idioma oficial do produto é o português.** O design mostra os cafés em português e o assistente deve usar os nomes em português (ex.: "Expresso Tradicional", "Café com Leite", "Cubano").

⚠️ **Pendência:** os dados carregados pelo código ainda estão **em inglês** (ex.: "Traditional Espresso", "Coffee with Milk", "Cuban"), com tags em inglês. A tabela acima relaciona o nome em português ao nome que existe hoje no código. Traduzir o catálogo no `CoffeeDataLoader` ainda não foi feito.

## Atualização do catálogo
❓ Não há endpoint nem tela para cadastrar, alterar ou remover cafés. Hoje, mudar o catálogo exige alterar o `CoffeeDataLoader` e recriar os dados no banco, pois o loader só roda quando a tabela está vazia.
