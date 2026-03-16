import { ChartColumn, Sparkles, Upload } from "lucide-react";

import { SectionHeading } from "@/components/layout/section-heading";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    title: "Suba o video",
    description:
      "O uploader foi pensado para parecer simples logo no primeiro contato: escolha o arquivo, veja preview, tamanho, preset e estimativa sem procurar demais.",
    icon: Upload
  },
  {
    title: "Escolha o objetivo",
    description:
      "Cortar, verticalizar, criar trailer, converter ou transformar em clipe viral. As ferramentas novas foram agrupadas pelo tipo de dor e nao por jargao tecnico.",
    icon: Sparkles
  },
  {
    title: "Volte mais rapido",
    description:
      "O produto incentiva repeticao com presets, historico, projetos e CTAs contextuais. O foco nao e so editar uma vez, e virar rotina de publicacao.",
    icon: ChartColumn
  }
];

export function HowItWorks() {
  return (
    <section className="container py-20">
      <SectionHeading
        eyebrow="Fluxo novo"
        title="Mais intuitivo para usar, melhor para reter e mais forte para vender"
        description="O redesenho do SmartClip coloca primeiro a acao que o usuario quer concluir, depois os extras premium que aumentam qualidade, velocidade e recorrencia."
        align="center"
      />

      <div className="mt-12 grid gap-4 lg:grid-cols-3">
        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <Card className="border-white/10 bg-white/[0.035]" key={step.title}>
              <CardContent className="space-y-5 p-6">
                <div className="flex items-center justify-between">
                  <div className="rounded-[1.3rem] border border-white/10 bg-white/[0.05] p-3 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-display text-5xl text-white/10">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="font-display text-2xl text-white">{step.title}</h3>
                <p className="text-sm leading-7 text-white/65">{step.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
