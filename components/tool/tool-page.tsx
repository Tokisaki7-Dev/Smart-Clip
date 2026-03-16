import Link from "next/link";
import { ArrowRight, Sparkles, Target, Zap } from "lucide-react";

import type { ToolDefinition } from "@/types";

import { AdsenseSlot } from "@/components/ads/adsense-slot";
import { SectionHeading } from "@/components/layout/section-heading";
import { CtaStrip } from "@/components/marketing/cta-strip";
import { UploadPanel } from "@/components/tool/upload-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getRelatedTools } from "@/services/tools";

interface ToolPageProps {
  tool: ToolDefinition;
}

export function ToolPage({ tool }: ToolPageProps) {
  const relatedTools = getRelatedTools(tool.slug);

  return (
    <div className="space-y-20">
      <section className="container py-12">
        <div className="grid gap-8 xl:grid-cols-[0.88fr,1.12fr]">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <Badge variant="primary">{tool.kicker}</Badge>
              <Badge variant="secondary">{tool.category}</Badge>
              <Badge variant="secondary">{tool.attentionLabel}</Badge>
            </div>

            <div className="space-y-4">
              <h1 className="font-display text-5xl leading-[0.95] text-white sm:text-6xl">
                {tool.title}
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-white/68">
                {tool.longDescription}
              </p>
            </div>

            <div className="rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-center gap-3 text-primary">
                <Target className="h-4 w-4" />
                <span className="text-xs uppercase tracking-[0.24em]">
                  Promessa da ferramenta
                </span>
              </div>
              <p className="mt-4 text-sm leading-7 text-white/72">{tool.promise}</p>
              <p className="mt-3 text-sm leading-7 text-white/52">{tool.audience}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {tool.useCases.map((item) => (
                <div
                  className="rounded-[1.5rem] border border-white/10 bg-black/20 px-4 py-4 text-sm text-white/80"
                  key={item}
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {tool.platforms.map((platform) => (
                <span className="metric-chip" key={platform}>
                  {platform}
                </span>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="#smartclip-uploader">Iniciar agora</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/signup">Salvar no dashboard</Link>
              </Button>
            </div>
          </div>

          <UploadPanel tool={tool} />
        </div>
      </section>

      <section className="container">
        <div className="grid gap-4 lg:grid-cols-[0.9fr,1.1fr]">
          <Card className="border-white/10 bg-white/[0.04]">
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center gap-3 text-primary">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs uppercase tracking-[0.24em]">
                  Porque essa rota chama atencao
                </span>
              </div>
              <h2 className="font-display text-3xl text-white">
                Ferramenta com valor rapido e discurso facil de entender
              </h2>
              <p className="text-sm leading-7 text-white/68">
                Quanto mais clara a promessa, maior a chance de clique, uso
                imediato e retorno. Por isso a pagina combina copy comercial,
                upload visivel e CTA forte no topo.
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {tool.supportedOutputs.map((output) => (
              <Card className="border-white/10 bg-white/[0.03]" key={output}>
                <CardContent className="space-y-3 p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-white/42">
                    Saida suportada
                  </p>
                  <p className="font-display text-2xl text-white">{output}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="container">
        <AdsenseSlot
          className="max-w-5xl"
          label="Pagina de ferramenta abaixo do resultado"
          slotKey="toolResult"
        />
      </section>

      <section className="container">
        <SectionHeading
          eyebrow="Ferramentas relacionadas"
          title="Quem entrou por uma dor pode sair com um fluxo inteiro pronto"
          description="As rotas se conectam para aumentar paginas por sessao, profundidade de uso e oportunidade de upgrade sem parecer forçado."
        />

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {relatedTools.map((relatedTool) => (
            <Card className="border-white/10 bg-white/[0.035]" key={relatedTool.slug}>
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.22em] text-primary/85">
                    {relatedTool.kicker}
                  </p>
                  {relatedTool.featured ? (
                    <Zap className="h-4 w-4 text-secondary" />
                  ) : null}
                </div>
                <h3 className="font-display text-2xl text-white">{relatedTool.title}</h3>
                <p className="text-sm leading-7 text-white/65">
                  {relatedTool.shortDescription}
                </p>
                <Button asChild className="justify-between" variant="secondary">
                  <Link href={`/${relatedTool.slug}#smartclip-uploader`}>
                    Iniciar fluxo
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container pb-16">
        <CtaStrip
          description="Use a ferramenta agora, valide o formato e suba de plano quando automacao, 1080p ou sem marca d'agua deixarem de ser extra e virarem rotina."
          primaryHref="/signup"
          primaryLabel="Testar gratis"
          secondaryHref="/pricing"
          secondaryLabel="Ver comparacao de planos"
          title="O foco aqui e deixar o primeiro resultado muito facil de conseguir"
        />
      </section>
    </div>
  );
}
