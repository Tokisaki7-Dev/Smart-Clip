import { Bolt, History, Repeat, Save } from "lucide-react";

import { SectionHeading } from "@/components/layout/section-heading";
import { Card, CardContent } from "@/components/ui/card";

const freeHighlights = [
  {
    title: "Muito util no gratis",
    description:
      "18 exportacoes por dia, upload ate 800 MB, presets sociais e 1 projeto salvo deixam o plano free de verdade usavel.",
    icon: Bolt
  },
  {
    title: "Historico que traz o usuario de volta",
    description:
      "Arquivos recentes, tempo de expiracao e ultimas exportacoes incentivam retorno sem depender de empurrao agressivo.",
    icon: History
  },
  {
    title: "Repetir ultima exportacao",
    description:
      "Uma das alavancas mais simples de retencao: menos decisao no proximo acesso, mais rapidez para publicar.",
    icon: Repeat
  },
  {
    title: "Projeto simples salvo",
    description:
      "Mesmo o plano gratis consegue memorizar um fluxo util. Isso prova valor e puxa o upgrade certo quando a rotina cresce.",
    icon: Save
  }
];

export function FreeValueSection() {
  return (
    <section className="container py-16">
      <SectionHeading
        eyebrow="Retencao do plano gratis"
        title="O gratis precisa ser bom o bastante para virar habito"
        description="O SmartClip mostra valor logo no primeiro uso, sem liberar tudo de uma vez. Assim o produto retém melhor e a conversao acontece na hora certa."
      />

      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        {freeHighlights.map((item) => {
          const Icon = item.icon;

          return (
            <Card className="border-white/8 bg-gradient-to-b from-white/[0.05] to-transparent" key={item.title}>
              <CardContent className="flex gap-4 p-6">
                <div className="rounded-2xl bg-white/6 p-3 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-display text-xl text-white">{item.title}</h3>
                  <p className="text-sm leading-7 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
