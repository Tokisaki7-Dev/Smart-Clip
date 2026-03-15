import Link from "next/link";
import { ArrowRight, BadgeCheck, Film, WandSparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toolDefinitions } from "@/services/tools";

const heroHighlights = [
  "Legenda automatica com uso gratis controlado",
  "Presets prontos para Reels, Shorts, TikTok, Stories e WhatsApp",
  "Arquitetura preparada para worker FFmpeg e fila via Supabase"
];

export function Hero() {
  return (
    <section className="overflow-hidden border-b border-white/6">
      <div className="container grid gap-10 py-12 lg:grid-cols-[1.05fr,0.95fr] lg:py-20">
        <div className="relative space-y-8">
          <div className="absolute -left-20 top-16 h-52 w-52 rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute left-24 top-60 h-40 w-40 rounded-full bg-[#8A5CFF]/18 blur-[120px]" />

          <div className="space-y-6">
            <div className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-primary">
              SaaS premium para clipes, legenda e exportacao social
            </div>

            <div className="space-y-4">
              <h1 className="max-w-3xl font-display text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
                Transforme seus videos em clipes prontos com legenda automatica,
                1080p e formatos para redes sociais em poucos cliques.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                O SmartClip nasceu para upload simples, automacao valiosa,
                dashboard que incentiva retorno e upgrade elegante sem frustrar o
                plano gratis.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/signup">
                  Testar gratis
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/pricing">Ver planos</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-3">
            {heroHighlights.map((item) => (
              <div
                className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3"
                key={item}
              >
                <BadgeCheck className="mt-0.5 h-5 w-5 text-primary" />
                <span className="text-sm leading-6 text-white/85">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <Card className="relative overflow-hidden border-primary/20 bg-[#0B122D]/90 shadow-glow">
          <div className="absolute inset-0 bg-hero-grid bg-[size:32px_32px] opacity-[0.14]" />
          <CardContent className="relative space-y-6 p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-primary/80">
                  Preview do produto
                </p>
                <h2 className="mt-2 font-display text-2xl text-white">
                  Fluxo desenhado para retorno
                </h2>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-2 text-sm text-white/80">
                Free ainda muito util
              </div>
            </div>

            <div className="grid gap-4 rounded-[1.5rem] border border-white/10 bg-[#091024]/90 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-primary/15 p-3 text-primary">
                    <Film className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ultimo preset</p>
                    <p className="font-medium text-white">Reels 1080x1920</p>
                  </div>
                </div>
                <div className="rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs text-success">
                  2 exportacoes 1080p restantes
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/8 bg-gradient-to-br from-white/8 to-white/[0.02] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Automações do mes</p>
                    <p className="mt-1 text-2xl font-semibold text-white">2 de 3 livres</p>
                  </div>
                  <div className="rounded-2xl bg-[#8A5CFF]/14 p-3 text-[#B89CFF]">
                    <WandSparkles className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-white/70">
                  Use seus clipes automaticos gratuitos para provar valor e
                  compre creditos avulsos ou assine quando o fluxo ficar
                  recorrente.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {toolDefinitions.slice(0, 4).map((tool) => (
                  <Link
                    className="rounded-2xl border border-white/8 bg-white/[0.04] p-4 transition hover:-translate-y-1 hover:border-primary/40"
                    href={`/${tool.slug}`}
                    key={tool.slug}
                  >
                    <p className="text-sm text-primary">{tool.kicker}</p>
                    <p className="mt-2 font-medium text-white">{tool.title}</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {tool.shortDescription}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
