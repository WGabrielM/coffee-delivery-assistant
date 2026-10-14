# 07 · Front-end

Fonte: `coffee-delivery-frontend/` (`src/`, `index.html`, `package.json`, `vite.config.ts`)

## O que existe
- ✅ `App` envolve a aplicação com o `ThemeProvider` do styled-components, renderiza `Header` e `Home` e aplica os estilos globais.
- ✅ `Header`: logotipo à esquerda; à direita, um rótulo de localização com o texto fixo "Porto Alegre, RS" e o ícone do carrinho.
- ❌ `Home` está vazia: renderiza apenas um `div` com o texto "Home".
- ❌ Não existem catálogo, cartão de café, carrinho, tela de checkout nem tela de confirmação **no código**. Essas telas existem apenas no design (ver [12-fluxo-de-compra](12-fluxo-de-compra.md)).

## Comunicação com a API
❌ O front-end ainda não faz nenhuma chamada à API. A API também não tem CORS configurado, o que será necessário quando o front-end passar a consumi-la.

## Tema
O tema padrão (`defaultTheme`) define cores:

| Grupo | Chaves |
|---|---|
| Neutras | `white`, `background`, `base-card`, `base-input`, `base-button`, `base-hover`, `base-label`, `base-text`, `base-subtitle`, `base-title` |
| Roxo | `purple-light`, `purple`, `purple-dark` |
| Amarelo | `yellow-light`, `yellow`, `yellow-dark` |

No cabeçalho, o rótulo de localização usa roxo claro/escuro e o botão do carrinho usa amarelo claro.

## Fontes
- `index.html` carrega Roboto, Roboto Mono e Baloo 2 pelo Google Fonts.
- Os estilos globais usam Roboto, com peso 400 e tamanho de 1rem, em `body`, `input`, `textarea` e `button`.
- A fonte Baloo 2 está carregada, mas só aparece em um trecho de código comentado, ou seja, ainda não é usada.

## Estilos globais
- Reset de `margin` e `padding`.
- ⚠️ A regra `box-sizing: 0` é um valor inválido para a propriedade (o esperado seria `border-box`). Hoje ela é ignorada pelo navegador.

## Assets
- Em `src/assets/`: `logo.svg`, `cart-icon.svg`, `location-pin.svg`, `coffee-fill.svg` e `react.svg`.
- O favicon é `coffee-fill.svg`.
- O cabeçalho referencia `/src/assets/logo.svg` e `/src/assets/cart-icon.svg` por caminho direto, em vez de importá-los. Isso funciona no servidor de desenvolvimento, mas pode quebrar no build de produção.

## Tecnologia e scripts
React 18.3, styled-components 6, TypeScript 5.5 e Vite 5.4. O projeto usa Yarn. Scripts: `dev`, `build`, `lint`, `preview`. O `README.md` do front-end é o texto padrão do template React + Vite, sem informação específica do projeto.
