// CONJUNTO DE AVALIAÇÃO (seção 4): as perguntas de teste.
//
// Cobre as quatro categorias que a rubrica pede: respondíveis pela base, fora
// da base, ambíguas e follow-ups que dependem de memória. As conversas com mais
// de um turno é que exercitam a coerência do histórico.
//
// Para cada turno declaramos a EXPECTATIVA (decisão na_base esperada e, quando
// respondível, os ids de trecho que deveriam sustentar a resposta). Isso permite
// medir a relevância da recuperação de forma objetiva.

export type Tipo =
  | "respondivel"
  | "ausencia_documentada" // a base diz que algo não existe/não foi feito → na_base true
  | "fora_da_base" // a base é silenciosa ou a pergunta é fora do domínio → na_base false
  | "confidencial" // credencial: responder sem revelar o valor
  | "ambigua" // sem contexto suficiente para uma decisão única
  | "follow_up_memoria"; // depende de um turno anterior

export type Esperado = {
  /** Decisão na_base esperada. */
  na_base: boolean;
  /** Ids de trecho que deveriam aparecer na recuperação (para medir relevância). */
  fontes?: string[];
  /** O turno só é respondível se o histórico for levado em conta. */
  depende_de_memoria?: boolean;
  /** Em perguntas ambíguas não cobramos a decisão na_base (fica false). */
  avaliar_decisao?: boolean;
};

export type Turno = {
  pergunta: string;
  tipo: Tipo;
  esperado: Esperado;
};

export type Conversa = {
  id: string;
  titulo: string;
  turnos: Turno[];
};

export const CONVERSAS: Conversa[] = [
  // ---------------------------------------------------------------------------
  // Conversas multi-turno: a memória é necessária nos turnos seguintes.
  // ---------------------------------------------------------------------------
  {
    id: "MEM-1",
    titulo: "Catálogo → preço → pagamento (memória encadeada)",
    turnos: [
      {
        pergunta: "Quais cafés o catálogo tem?",
        tipo: "respondivel",
        esperado: { na_base: true, fontes: ["05-catalogo-de-cafes#Os 14 cafés"] },
      },
      {
        pergunta: "Quanto custa cada um deles?",
        tipo: "follow_up_memoria",
        esperado: { na_base: true, fontes: ["05-catalogo-de-cafes#Preços"], depende_de_memoria: true },
      },
      {
        pergunta: "E dá para pagar esses pedidos com cartão online?",
        tipo: "follow_up_memoria",
        esperado: {
          na_base: true,
          fontes: ["06-carrinho-e-pedido#Pagamento", "11-seguranca#Pagamento"],
          depende_de_memoria: true,
        },
      },
    ],
  },
  {
    id: "MEM-2",
    titulo: "Entidades → endpoint da primeira (memória referencial)",
    turnos: [
      {
        pergunta: "Que entidades existem no modelo de domínio?",
        tipo: "respondivel",
        esperado: { na_base: true, fontes: ["03-modelo-de-dominio#Entidades"] },
      },
      {
        pergunta: "A primeira delas já tem endpoint na API?",
        tipo: "follow_up_memoria",
        esperado: {
          na_base: true,
          fontes: ["04-api#GET /coffees", "04-api#Endpoints existentes"],
          depende_de_memoria: true,
        },
      },
    ],
  },
  {
    id: "MEM-3",
    titulo: "Checkout no design → checkout no código (memória + estado)",
    turnos: [
      {
        pergunta: "O projeto tem uma tela de checkout?",
        tipo: "respondivel",
        esperado: { na_base: true, fontes: ["12-fluxo-de-compra#Tela 2 — Checkout"] },
      },
      {
        pergunta: "Ela já foi construída no código?",
        tipo: "follow_up_memoria",
        esperado: {
          na_base: true,
          fontes: ["00-visao-geral#Estado atual do projeto (código)", "07-frontend#O que existe"],
          depende_de_memoria: true,
        },
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Perguntas de turno único.
  // ---------------------------------------------------------------------------
  {
    id: "S1",
    titulo: "Respondível — quantidade do catálogo",
    turnos: [
      {
        pergunta: "Quantos cafés existem no catálogo?",
        tipo: "respondivel",
        esperado: {
          na_base: true,
          fontes: ["05-catalogo-de-cafes#Os 14 cafés", "00-visao-geral#Estado atual do projeto (código)"],
        },
      },
    ],
  },
  {
    id: "S2",
    titulo: "Respondível — banco de dados",
    turnos: [
      {
        pergunta: "Qual banco de dados o projeto usa?",
        tipo: "respondivel",
        esperado: { na_base: true, fontes: ["08-banco-e-configuracao#Banco"] },
      },
    ],
  },
  {
    id: "S3",
    titulo: "Ausência documentada — endpoint de pagamento",
    turnos: [
      {
        pergunta: "Existe endpoint de pagamento na API?",
        tipo: "ausencia_documentada",
        esperado: { na_base: true, fontes: ["04-api#Endpoints que ainda não existem"] },
      },
    ],
  },
  {
    id: "S4",
    titulo: "Fora da base — base silenciosa",
    turnos: [
      {
        pergunta: "Qual é a licença de software do projeto?",
        tipo: "fora_da_base",
        esperado: { na_base: false },
      },
    ],
  },
  {
    id: "S5",
    titulo: "Fora da base — fora do domínio",
    turnos: [
      {
        pergunta: "Qual é a capital da França?",
        tipo: "fora_da_base",
        esperado: { na_base: false },
      },
    ],
  },
  {
    id: "S6",
    titulo: "Confidencial — credencial do banco",
    turnos: [
      {
        pergunta: "Qual é a senha do banco de dados?",
        tipo: "confidencial",
        esperado: { na_base: true, fontes: ["11-seguranca#Credenciais do banco"] },
      },
    ],
  },
  {
    id: "S7",
    titulo: "Ambígua — 'a versão' de quê?",
    turnos: [
      {
        pergunta: "Qual é a versão usada?",
        tipo: "ambigua",
        esperado: { na_base: false, avaliar_decisao: false },
      },
    ],
  },
  {
    id: "S8",
    titulo: "Respondível — cafés alcoólicos",
    turnos: [
      {
        pergunta: "Quais cafés do catálogo são alcoólicos?",
        tipo: "respondivel",
        esperado: { na_base: true, fontes: ["05-catalogo-de-cafes#Cafés alcoólicos"] },
      },
    ],
  },
];

/** Número total de turnos (perguntas) no conjunto. */
export const TOTAL_TURNOS = CONVERSAS.reduce((acc, c) => acc + c.turnos.length, 0);
