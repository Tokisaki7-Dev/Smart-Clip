import Link from "next/link";

import { SectionHeading } from "@/components/layout/section-heading";
import { Card, CardContent } from "@/components/ui/card";

const intentLinks = [
  {
    title: "Transformar video em clipe com legenda automatica",
    description: "Entrada comercial forte para TikTok, Shorts, Reels e Stories em 1080p.",
    href: "/video-para-clipe-com-legenda-automatica"
  },
  {
    title: "Transformar video em clipe viral curto",
    description: "Termo amplo, facil de entender e com alto potencial de descoberta.",
    href: "/video-para-clipe-viral"
  },
  {
    title: "Gerar varios clipes automaticos do mesmo video",
    description: "Dor clara de creators, podcasts, aulas e times de social media.",
    href: "/gerar-varios-clipes-automaticos"
  },
  {
    title: "Video horizontal para vertical",
    description: "Capta acervo antigo e reaproveitamento para redes sociais.",
    href: "/video-horizontal-para-vertical"
  },
  {
    title: "Video para Reels, Shorts e TikTok",
    description: "Busca recorrente de alto valor para formatos sociais prontos.",
    href: "/guias/video-para-redes-sociais"
  },
  {
    title: "Comprimir video para WhatsApp e Status",
    description: "Termos práticos com volume alto e uso recorrente.",
    href: "/guias/compressao-de-video"
  }
];

export function PopularSearches() {
  return (
    <section className="container py-18">
      <SectionHeading
        eyebrow="Buscas populares"
        title="Entradas comerciais pensadas para puxar clique, resolver a dor e abrir outras ferramentas"
        description="Esses caminhos ajudam o SmartClip a crescer com busca qualificada e mais paginas por sessao sem depender so da home."
      />
      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {intentLinks.map((item) => (
          <Card className="border-white/10 bg-white/[0.035]" key={item.href}>
            <CardContent className="space-y-4 p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-primary">Alta intencao</p>
              <h3 className="font-display text-2xl text-white">{item.title}</h3>
              <p className="text-sm leading-7 text-white/68">{item.description}</p>
              <Link
                className="text-sm font-medium text-primary transition hover:text-white"
                href={item.href}
              >
                Abrir rota
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
