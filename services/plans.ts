import { type Plan } from "@/types";

export const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: "R$ 0",
    description:
      "Entrega valor rapido, prova os recursos premium e cria habito sem afastar quem esta chegando.",
    audience: "Para testar fluxo, publicar com rapidez e sentir o ganho do SmartClip.",
    ctaLabel: "Comecar gratis",
    quotas: [
      { label: "Upload", value: "ate 800 MB" },
      { label: "Exportacoes por dia", value: "18" },
      { label: "Resolucao", value: "720p padrao" },
      { label: "Retencao", value: "48 horas" }
    ],
    premiumUnlocks: [
      "3 clipes automaticos por mes",
      "3 legendas automaticas por mes",
      "2 exportacoes sem marca d'agua por mes",
      "2 exportacoes em 1080p por mes"
    ],
    retentionHooks: [
      "Historico dos ultimos 15 arquivos",
      "1 projeto salvo simples",
      "Repetir ultima exportacao",
      "Presets para Reels, Shorts, TikTok, Stories e WhatsApp"
    ],
    limitations: [
      "Sem multiplos cortes avancados",
      "Sem exportacao em lote",
      "Sem fila prioritaria"
    ]
  },
  {
    id: "starter",
    name: "Starter",
    price: "R$ 24,90",
    monthlyPrice: 24.9,
    description:
      "Plano de menor atrito para quem ja viu valor no gratis e quer remover as principais barreiras.",
    audience: "Para criadores que publicam toda semana e querem previsibilidade.",
    ctaLabel: "Testar 30 dias",
    trial: "30 dias gratis com cartao e cancelamento no painel",
    quotas: [
      { label: "Upload", value: "ate 2,5 GB" },
      { label: "Exportacoes por dia", value: "100" },
      { label: "Resolucao", value: "1080p sempre" },
      { label: "Fila", value: "rapida" }
    ],
    premiumUnlocks: [
      "Sem marca d'agua em todas as exportacoes",
      "25 clipes automaticos por mes",
      "25 legendas automaticas por mes",
      "Presets salvos"
    ],
    retentionHooks: [
      "Historico completo",
      "5 projetos salvos",
      "Compressao avancada",
      "Retencao de 7 dias"
    ]
  },
  {
    id: "creator",
    name: "Creator",
    price: "R$ 49,90",
    monthlyPrice: 49.9,
    description:
      "Equilibrio mais forte entre velocidade, automacao, exportacao ilimitada e margem do negocio.",
    audience: "Para quem produz recorrencia, testa formatos e precisa de fluxo sem atrito.",
    ctaLabel: "Escolher Creator",
    badge: "Mais popular",
    highlighted: true,
    quotas: [
      { label: "Upload", value: "ate 8 GB" },
      { label: "Exportacoes", value: "ilimitadas" },
      { label: "Fila", value: "prioritaria" },
      { label: "Retencao", value: "30 dias" }
    ],
    premiumUnlocks: [
      "120 clipes automaticos por mes",
      "120 legendas automaticas por mes",
      "Multiplas saidas do mesmo video",
      "Reaplicar ultima configuracao"
    ],
    retentionHooks: [
      "Projetos ilimitados",
      "Duplicar projeto",
      "Multiplos cortes por video",
      "Templates e presets automaticos"
    ]
  },
  {
    id: "pro",
    name: "Pro",
    price: "R$ 89,90",
    monthlyPrice: 89.9,
    description:
      "Capacidade maxima para times e criadores intensivos com prioridade total e recursos avancados.",
    audience: "Para operacoes pesadas, 4K e automacao praticamente sem limite.",
    ctaLabel: "Escalar com Pro",
    quotas: [
      { label: "Upload", value: "ate 25 GB" },
      { label: "Exportacoes", value: "ilimitadas" },
      { label: "Resolucao", value: "4K" },
      { label: "Prioridade", value: "maxima" }
    ],
    premiumUnlocks: [
      "Clipes automaticos ilimitados",
      "Legendas automaticas ilimitadas",
      "Templates de legenda",
      "Recursos beta"
    ],
    retentionHooks: [
      "Retencao de 90 dias",
      "Suporte prioritario",
      "Processamento prioritario maximo",
      "Recursos avancados de equipe"
    ]
  }
];

export const faqItems = [
  {
    question: "O plano gratis entrega valor real?",
    answer:
      "Sim. O gratis permite upload, corte, compressao, conversao, presets sociais e uma dose controlada dos recursos premium para provar valor sem matar a conversao."
  },
  {
    question: "Por que o Creator recebe mais destaque?",
    answer:
      "Porque ele concentra o melhor custo-beneficio entre volume, automacoes, retencao e velocidade. E o plano com maior potencial de recorrencia sem friccao."
  },
  {
    question: "Posso comprar creditos sem assinar?",
    answer:
      "Sim. Os pacotes avulsos permitem usar clipes automaticos, legendas, Full HD extra e remocao de marca d'agua sem entrar em uma assinatura."
  },
  {
    question: "O cancelamento do Starter e feito no painel?",
    answer:
      "Sim. A interface de billing foi estruturada para cancelamento self-service, acompanhamento do trial e historico de cobranca."
  }
];
