import { Captions, Crown, Scissors, ShieldOff, Video } from "lucide-react";

import { SectionHeading } from "@/components/layout/section-heading";
import { Card, CardContent } from "@/components/ui/card";

const premiumHighlights = [
  {
    title: "Clipes automaticos",
    description:
      "Sao faceis de entender, vendem produtividade na hora e ajudam a puxar o usuario do gratis para planos que valem mais.",
    icon: Scissors
  },
  {
    title: "Legenda automatica",
    description:
      "Aumenta valor percebido e melhora retenção dos clipes. Continua sendo um dos motores mais claros de conversao.",
    icon: Captions
  },
  {
    title: "Sem marca d'agua",
    description:
      "A trava premium aparece no ponto certo: quando o usuario sente que o video ficou bom o bastante para entregar ou anunciar.",
    icon: ShieldOff
  },
  {
    title: "1080p e 4K",
    description:
      "A qualidade maior vira argumento comercial sem impedir teste inicial. Isso preserva experiencia e aumenta margem.",
    icon: Video
  }
];

export function PremiumHighlights() {
  return (
    <section className="container py-20">
      <SectionHeading
        eyebrow="Monetizacao inteligente"
        title="Os recursos premium continuam claros, desejaveis e muito faceis de justificar"
        description="O produto melhorou em usabilidade sem perder o desenho de lucro: provar valor no gratis e cobrar quando qualidade, recorrencia ou volume realmente pesam."
      />

      <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {premiumHighlights.map((item) => {
          const Icon = item.icon;

          return (
            <Card className="border-white/10 bg-[linear-gradient(180deg,rgba(34,224,255,0.08),rgba(255,255,255,0.02))]" key={item.title}>
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center justify-between">
                  <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.05] p-3 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <Crown className="h-4 w-4 text-secondary" />
                </div>
                <h3 className="font-display text-xl text-white">{item.title}</h3>
                <p className="text-sm leading-7 text-white/65">{item.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
