import type { AutomationPack, BillingSummary } from "@/types";

export const automationPacks: AutomationPack[] = [
  {
    id: "pack-10",
    name: "10 automacoes premium",
    price: "R$ 12,90",
    credits: 10,
    useCases: [
      "Clipes automaticos extras",
      "Legendas automaticas extras",
      "1080p adicional",
      "Sem marca d'agua adicional"
    ]
  },
  {
    id: "pack-30",
    name: "30 automacoes premium",
    price: "R$ 29,90",
    credits: 30,
    useCases: [
      "Campanhas sazonais",
      "Lotes pequenos de conteudo",
      "Reprocessamento recorrente",
      "Combinar captions e clipes"
    ]
  },
  {
    id: "pack-80",
    name: "80 automacoes premium",
    price: "R$ 59,90",
    credits: 80,
    useCases: [
      "Uso eventual pesado",
      "Picos de volume sem upgrade",
      "Operacao comercial enxuta",
      "Aceleracao de testes de criativos"
    ]
  }
];

export const paymentMethods = [
  "Cartao de credito",
  "Pix",
  "Boleto",
  "Debito online"
];

export const billingSnapshot: BillingSummary = {
  currentPlan: "Starter",
  trialMessage: "Faltam 11 dias do trial para converter sem interromper seus uploads.",
  nextCharge: "26 de marco de 2026",
  paymentMethod: "Cartao de credito Visa terminando em 4829",
  creditBalance: 12,
  nextRecommendedAction:
    "Ative o Creator quando seus clips automaticos mensais passarem de 25 para reduzir custo por uso."
};
