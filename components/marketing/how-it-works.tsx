import { Repeat2, Sparkles, Upload } from "lucide-react";

import { SectionHeading } from "@/components/layout/section-heading";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    title: "Envie o video",
    description:
      "Uploader grande com drag-and-drop, preview do arquivo e leitura do plano atual para mostrar o que esta liberado.",
    icon: Upload
  },
  {
    title: "Escolha o objetivo",
    description:
      "Cortar, comprimir, converter, exportar para redes ou acionar automacao premium com legenda e clipes.",
    icon: Sparkles
  },
  {
    title: "Volte mais rapido",
    description:
      "Historico, projeto salvo, repetir ultima exportacao e presets reduzem atrito na proxima sessao.",
    icon: Repeat2
  }
];

export function HowItWorks() {
  return (
    <section className="container py-16">
      <SectionHeading
        eyebrow="Como funciona"
        title="Um fluxo curto, premium e desenhado para criar habito"
        description="A experiencia precisa parecer forte desde o primeiro upload, mas o valor extra dos planos pagos aparece exatamente onde a rotina comeca a crescer."
        align="center"
      />

      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <Card className="border-white/8 bg-white/[0.03]" key={step.title}>
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center justify-between">
                  <div className="rounded-2xl bg-primary/12 p-3 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-4xl font-display text-white/12">0{index + 1}</span>
                </div>
                <h3 className="font-display text-2xl text-white">{step.title}</h3>
                <p className="text-sm leading-7 text-muted-foreground">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
