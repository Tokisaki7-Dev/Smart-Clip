import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SectionHeading } from "@/components/layout/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toolDefinitions } from "@/services/tools";

export function ToolGrid() {
  return (
    <section className="container py-16">
      <SectionHeading
        eyebrow="Ferramentas centrais"
        title="Rotas comerciais prontas para captar trafego e converter em uso"
        description="Cada ferramenta foi pensada como landing page de alta intencao, com CTA claro, texto orientado a SEO e espaco controlado para anuncios."
      />

      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {toolDefinitions.map((tool) => (
          <Card
            className="group border-white/8 bg-gradient-to-b from-white/[0.06] to-white/[0.02] transition hover:-translate-y-1 hover:border-primary/40"
            key={tool.slug}
          >
            <CardContent className="flex h-full flex-col gap-4 p-6">
              <div>
                <p className="text-sm text-primary">{tool.kicker}</p>
                <h3 className="mt-2 font-display text-2xl text-white">{tool.title}</h3>
              </div>
              <p className="flex-1 text-sm leading-7 text-muted-foreground">
                {tool.shortDescription}
              </p>
              <Button asChild className="w-full justify-between" variant="secondary">
                <Link href={`/${tool.slug}#smartclip-uploader`}>
                  Iniciar agora
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
