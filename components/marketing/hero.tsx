import Link from "next/link";
import { ArrowRight, BarChart3, Flame, Layers3, Sparkles, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getFeaturedTools } from "@/services/tools";

const heroStats = [
  { label: "Rotas de alta intencao", value: "22+" },
  { label: "Fluxos com uso imediato", value: "100%" },
  { label: "Presets sociais prontos", value: "20+" }
];

const heroPromises = [
  "Gerar clip 1080p com legenda automatica para redes sociais",
  "Transformar um video longo em varios clipes automaticos",
  "Gerar hooks curtos para testar abertura e criativo",
  "Transformar qualquer video em clipe viral curto",
  "Verticalizar videos horizontais com fundo blur"
];

export function Hero() {
  const featuredTools = getFeaturedTools();
  const spotlightTool = featuredTools[0];

  return (
    <section className="relative overflow-hidden border-b border-purple-500/20 bg-gradient-to-br from-black via-purple-900/20 to-black min-h-screen flex items-center">
      {/* Glow effects de fundo */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 -left-1/3 w-96 h-96 rounded-full bg-purple-600/30 blur-[120px] opacity-60" />
        <div className="absolute top-1/3 -right-1/4 w-96 h-96 rounded-full bg-magenta-500/20 blur-[120px] opacity-50" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-purple-500/10 blur-[100px]" />
      </div>

      <div className="container relative space-y-16 py-20">
        {/* Logo/Badge */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-purple-400 to-magenta-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-bold text-white">SMARTCLIP</span>
        </div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-6xl md:text-7xl font-bold leading-[1.1] text-white">
                Manage Your 
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-magenta-400 to-purple-400 text-transparent bg-clip-text">
                  Videos Efficiently
                </span>
              </h1>
              
              <p className="text-lg text-white/70 leading-relaxed max-w-lg">
                Corte, edite e transforme seus videos em conteúdo profissional para redes sociais em poucos cliques. Com IA inteligente e edição sem complexidade.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 py-8 border-y border-purple-500/20">
              {heroStats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-magenta-400 text-transparent bg-clip-text">{stat.value}</p>
                  <p className="text-sm text-white/60 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex gap-4">
              <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-magenta-600 hover:from-purple-700 hover:to-magenta-700 text-white border-0">
                <Link href={`/${spotlightTool.slug}#smartclip-uploader`}>
                  Começar 
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-purple-500/50 hover:bg-purple-500/10 text-white">
                <Link href="/tools">Explorar →</Link>
              </Button>
            </div>
          </div>

          {/* Right side - Card com destaque */}
          <div className="relative">
            {/* Card principal com glow */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/50 to-magenta-600/50 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-60" />
              
              <Card className="relative border border-purple-500/30 bg-gradient-to-br from-purple-900/40 via-black/50 to-black/80 backdrop-blur-xl shadow-2xl overflow-hidden">
                {/* Glow inner */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-magenta-500/20 pointer-events-none" />
                
                <CardContent className="relative p-8 space-y-6">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-purple-400 font-semibold">Ferramenta em foco</span>
                    <h2 className="text-3xl font-bold text-white mt-2">{spotlightTool.title}</h2>
                  </div>

                  {/* Feature grid inside card */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Legenda", value: "Automática" },
                      { label: "Qualidade", value: "1080p+" },
                      { label: "Formatos", value: "20+" },
                      { label: "Velocidade", value: "Instant" }
                    ].map((item) => (
                      <div key={item.label} className="p-3 rounded-lg bg-purple-500/10 border border-purple-400/30">
                        <p className="text-xs text-white/60">{item.label}</p>
                        <p className="text-sm font-semibold text-purple-300">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  <p className="text-white/70 leading-relaxed">
                    {spotlightTool.shortDescription}
                  </p>

                  <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-magenta-600 hover:from-purple-700 hover:to-magenta-700">
                    <Link href={`/${spotlightTool.slug}#smartclip-uploader`}>
                      Testar agora
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Feature list abaixo */}
        <div className="grid md:grid-cols-3 gap-4 pt-8">
          {heroPromises.slice(0, 3).map((promise, idx) => (
            <div key={idx} className="p-4 rounded-lg border border-purple-500/20 bg-purple-500/5 backdrop-blur hover:border-purple-500/50 transition-all group cursor-pointer">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5 group-hover:translate-y-0.5 transition-transform" />
                <p className="text-sm text-white/80 group-hover:text-white transition-colors">{promise}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

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
