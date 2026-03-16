import Link from "next/link";
import { ArrowRight, BarChart3, Flame, Layers3, Sparkles, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getFeaturedTools } from "@/services/tools";

const heroStats = [
  { label: "Rotas de alta intencao", value: "18+" },
  { label: "Fluxos com uso imediato", value: "100%" },
  { label: "Presets sociais prontos", value: "14+" }
];

const heroPromises = [
  "Gerar clip 1080p com legenda automatica para redes sociais",
  "Transformar um video longo em varios clipes automaticos",
  "Transformar qualquer video em clipe viral curto",
  "Verticalizar videos horizontais com fundo blur"
];

export function Hero() {
  const featuredTools = getFeaturedTools();
  const spotlightTool = featuredTools[0];
  const sideTools = featuredTools.slice(1, 4);

  return (
    <section className="overflow-hidden border-b border-white/6">
      <div className="container grid gap-10 py-12 lg:grid-cols-[1.08fr,0.92fr] lg:py-20">
        <div className="relative space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-primary">
            <Flame className="h-3.5 w-3.5" />
            Site feito para atrair trafego e converter em uso
          </div>

          <div className="space-y-5">
            <h1 className="max-w-4xl font-display text-5xl leading-[0.94] text-white sm:text-6xl lg:text-7xl">
              Suba qualquer video e transforme em clipes curtos 1080p com mais
              cara de pronto para TikTok, Shorts, Reels e Stories.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-white/68">
              O SmartClip agora combina ferramentas de alto apelo organico,
              presets inteligentes, legenda automatica no navegador e um fluxo
              muito mais bonito para cortar, verticalizar, gerar varios clipes,
              resumir, comprimir e publicar sem friccao.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {heroStats.map((stat) => (
              <div
                className="rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-4"
                key={stat.label}
              >
                <p className="text-3xl font-semibold text-white">{stat.value}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/48">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href={`/${spotlightTool.slug}#smartclip-uploader`}>
                Testar ferramenta principal
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/tools">Explorar todas as ferramentas</Link>
            </Button>
          </div>

          <div className="grid gap-3">
            {heroPromises.map((item) => (
              <div
                className="flex items-center gap-3 rounded-[1.5rem] border border-white/8 bg-white/[0.03] px-4 py-3"
                key={item}
              >
                <Zap className="h-4 w-4 text-accent" />
                <span className="text-sm text-white/80">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <Card className="relative overflow-hidden border-white/10 bg-[radial-gradient(circle_at_top,rgba(34,224,255,0.18),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] shadow-glow">
          <div className="absolute inset-0 bg-hero-grid bg-[size:32px_32px] opacity-[0.06]" />
          <CardContent className="relative space-y-6 p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-primary">
                  Ferramenta em foco
                </p>
                <h2 className="mt-2 font-display text-3xl text-white">
                  {spotlightTool.title}
                </h2>
              </div>
              <div className="metric-chip">{spotlightTool.category}</div>
            </div>

            <div className="rounded-[1.8rem] border border-white/10 bg-black/20 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-primary">{spotlightTool.kicker}</p>
                  <p className="mt-2 text-base leading-7 text-white/75">
                    {spotlightTool.shortDescription}
                  </p>
                </div>
                <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.05] p-3 text-primary">
                  <Sparkles className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-4">
                  <div className="flex items-center gap-2 text-secondary">
                    <Layers3 className="h-4 w-4" />
                    <span className="text-xs uppercase tracking-[0.2em]">
                      O que ela faz
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-white/72">
                    Heuristicas de corte curto, framing vertical e audio mais
                    forte para publicar mais rapido.
                  </p>
                </div>
                <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-4">
                  <div className="flex items-center gap-2 text-accent">
                    <BarChart3 className="h-4 w-4" />
                    <span className="text-xs uppercase tracking-[0.2em]">
                      Por que atrai
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-white/72">
                    Resolve uma dor muito clara: transformar um video longo em
                    conteudo curto mais consumivel.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {spotlightTool.platforms.map((platform) => (
                  <span className="metric-chip" key={platform}>
                    {platform}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-3">
              {sideTools.map((tool) => (
                <Link
                  className="group flex items-center justify-between rounded-[1.4rem] border border-white/10 bg-white/[0.04] px-4 py-4 transition hover:-translate-y-1 hover:border-primary/30 hover:bg-white/[0.06]"
                  href={`/${tool.slug}`}
                  key={tool.slug}
                >
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-primary/80">
                      {tool.attentionLabel}
                    </p>
                    <p className="mt-2 font-medium text-white">{tool.title}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-white/45 transition group-hover:text-primary" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
