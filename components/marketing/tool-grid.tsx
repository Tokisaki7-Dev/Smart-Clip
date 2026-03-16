import Link from "next/link";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";

import { SectionHeading } from "@/components/layout/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getToolsByCategory } from "@/services/tools";

export function ToolGrid() {
  const groupedTools = getToolsByCategory();

  return (
    <section className="container py-20">
      <SectionHeading
        eyebrow="Ferramentas que puxam trafego"
        title="Rotas prontas para buscas comerciais, uso imediato e upgrade elegante"
        description="O novo catalogo foi reorganizado para ser facil de navegar, forte em SEO e mais convincente para quem quer resolver algo agora."
      />

      <div className="mt-12 space-y-8">
        {groupedTools.map((group) => (
          <div className="space-y-5" key={group.category}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-primary">
                  {group.category}
                </p>
                <p className="mt-2 text-sm text-white/55">
                  {group.tools.length} rotas preparadas para captar visitas e
                  converter em uso.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {group.tools.map((tool) => (
                <Card
                  className="group overflow-hidden border-white/10 bg-white/[0.035] transition duration-300 hover:-translate-y-1 hover:border-primary/35"
                  key={tool.slug}
                >
                  <CardContent className="flex h-full flex-col gap-5 p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-primary/85">
                          {tool.kicker}
                        </p>
                        <h3 className="mt-3 font-display text-2xl leading-tight text-white">
                          {tool.title}
                        </h3>
                      </div>
                      {tool.featured ? (
                        <div className="rounded-full border border-secondary/30 bg-secondary/12 p-2 text-secondary">
                          <Sparkles className="h-4 w-4" />
                        </div>
                      ) : null}
                    </div>

                    <p className="text-sm leading-7 text-white/68">
                      {tool.shortDescription}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <span className="metric-chip">{tool.attentionLabel}</span>
                      {tool.featured ? (
                        <span className="metric-chip">
                          <TrendingUp className="mr-1 inline h-3.5 w-3.5 text-primary" />
                          Destaque
                        </span>
                      ) : null}
                    </div>

                    <p className="rounded-[1.35rem] border border-white/8 bg-black/20 p-4 text-sm leading-7 text-white/62">
                      {tool.promise}
                    </p>

                    <Button asChild className="mt-auto w-full justify-between" variant="secondary">
                      <Link href={`/${tool.slug}#smartclip-uploader`}>
                        Iniciar agora
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
