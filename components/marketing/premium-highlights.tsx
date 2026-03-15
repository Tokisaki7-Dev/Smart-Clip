import { Captions, Crown, Scissors, ShieldOff, Video } from "lucide-react";

import { SectionHeading } from "@/components/layout/section-heading";
import { Card, CardContent } from "@/components/ui/card";

const premiumHighlights = [
  {
    title: "Clipes automaticos",
    description:
      "Mostre poucas geracoes gratis por mes e deixe claro como o Creator reduz custo por rotina recorrente.",
    icon: Scissors
  },
  {
    title: "Legenda automatica",
    description:
      "Recurso premium facil de entender, excelente para provar valor e elevar a percepcao de qualidade.",
    icon: Captions
  },
  {
    title: "Sem marca d'agua",
    description:
      "Uma das travas mais naturais de conversao: o usuario sente valor quando o material precisa parecer pronto para entregar.",
    icon: ShieldOff
  },
  {
    title: "1080p e 4K",
    description:
      "A resolucao premium entra exatamente quando o video aprovado merece acabamento melhor, sem bloquear o teste inicial.",
    icon: Video
  }
];

export function PremiumHighlights() {
  return (
    <section className="container py-16">
      <SectionHeading
        eyebrow="Recursos premium centrais"
        title="O upgrade faz sentido porque o ganho fica claro"
        description="As features premium do SmartClip foram escolhidas para serem percebidas rapido, criar desejo de continuidade e preservar a experiencia do plano gratis."
      />

      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {premiumHighlights.map((item) => {
          const Icon = item.icon;

          return (
            <Card className="border-primary/15 bg-[#09112A]" key={item.title}>
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center justify-between">
                  <div className="rounded-2xl bg-primary/12 p-3 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <Crown className="h-4 w-4 text-[#B89CFF]" />
                </div>
                <h3 className="font-display text-xl text-white">{item.title}</h3>
                <p className="text-sm leading-7 text-muted-foreground">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
