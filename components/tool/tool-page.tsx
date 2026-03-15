import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
    <div className="space-y-16">
      <section className="container py-12">
        <div className="grid gap-8 lg:grid-cols-[0.9fr,1.1fr]">
          <div className="space-y-6">
            <Badge variant="primary">{tool.kicker}</Badge>
            <div className="space-y-4">
              <h1 className="font-display text-4xl leading-tight text-white sm:text-5xl">
                {tool.title}
              </h1>
              <p className="text-lg leading-8 text-muted-foreground">
                {tool.longDescription}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {tool.useCases.map((item) => (
                <div
                  className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/82"
                  key={item}
                >
                  {item}
                </div>
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
        <SectionHeading
          eyebrow="Saidas e SEO"
          title="Presets sociais, conversao contextual e links internos"
          description="Essas paginas sao desenhadas para ranquear bem, demonstrar o uso da ferramenta e levar o usuario direto para o fluxo de upload."
        />

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {tool.supportedOutputs.map((output) => (
            <Card className="border-white/8 bg-white/[0.03]" key={output}>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">Formato suportado</p>
                <p className="mt-2 font-display text-2xl text-white">{output}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container">
        <AdsenseSlot
          className="max-w-4xl"
          label="Pagina de ferramenta abaixo do resultado"
          slotKey="toolResult"
        />
      </section>

      <section className="container">
        <SectionHeading
          eyebrow="Ferramentas relacionadas"
          title="Links internos para manter o usuario dentro do ecossistema"
          description="Cada pagina de ferramenta puxa a proxima acao natural do usuario, fortalecendo o cluster SEO e a recorrencia do produto."
        />

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {relatedTools.map((relatedTool) => (
            <Card className="border-white/8 bg-white/[0.03]" key={relatedTool.slug}>
              <CardContent className="space-y-4 p-6">
                <p className="text-sm text-primary">{relatedTool.kicker}</p>
                <h3 className="font-display text-2xl text-white">{relatedTool.title}</h3>
                <p className="text-sm leading-7 text-muted-foreground">
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
          description="O plano gratis mostra valor com limites claros. Quando o fluxo fica recorrente, o upgrade para Starter ou Creator acontece sem estranheza."
          primaryHref="/signup"
          primaryLabel="Testar gratis"
          secondaryHref="/pricing"
          secondaryLabel="Ver comparacao de planos"
          title="Use esta ferramenta agora e leve o trabalho pesado para o SmartClip"
        />
      </section>
    </div>
  );
}
