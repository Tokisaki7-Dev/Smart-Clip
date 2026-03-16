import { Clock3, FolderClock, Repeat, Sparkles } from "lucide-react";

import { SectionHeading } from "@/components/layout/section-heading";
import { Card, CardContent } from "@/components/ui/card";

const freeHighlights = [
  {
    title: "Gratis de verdade",
    description:
      "O plano free continua util para gerar habito: upload generoso, exportacoes por dia, presets sociais e uma amostra clara dos recursos premium.",
    icon: Sparkles
  },
  {
    title: "Historico que puxa retorno",
    description:
      "Arquivos recentes, projetos e repeticao de exportacao ajudam o usuario a voltar porque o caminho ja ficou montado.",
    icon: FolderClock
  },
  {
    title: "Menos friccao na volta",
    description:
      "Presets e ultima configuracao reduzem decisao repetitiva. Isso aumenta retencao sem empurrar upgrade de forma agressiva.",
    icon: Repeat
  },
  {
    title: "Limites visiveis e honestos",
    description:
      "Saldo de 1080p, sem marca d'agua e automacoes aparece de forma clara para criar desejo de upgrade sem surpresa ruim.",
    icon: Clock3
  }
];

export function FreeValueSection() {
  return (
    <section className="container py-20">
      <SectionHeading
        eyebrow="Valor no gratis"
        title="O plano free foi mantido forte o bastante para criar habito, nao para virar amostra vazia"
        description="Essa combinacao ajuda o SmartClip a atrair mais gente, reduzir abandono e converter no momento certo quando a rotina fica frequente."
      />

      <div className="mt-12 grid gap-4 lg:grid-cols-2">
        {freeHighlights.map((item) => {
          const Icon = item.icon;

          return (
            <Card className="border-white/10 bg-white/[0.035]" key={item.title}>
              <CardContent className="flex gap-5 p-6">
                <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.05] p-3 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-3">
                  <h3 className="font-display text-2xl text-white">{item.title}</h3>
                  <p className="text-sm leading-7 text-white/65">{item.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
