import Link from "next/link";
import { ArrowUpRight, Crown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function UpgradePath() {
  return (
    <section className="container py-16">
      <Card className="overflow-hidden border-primary/20 bg-gradient-to-r from-[#081128] via-[#101936] to-[#17153A] shadow-glow">
        <CardContent className="grid gap-8 p-8 lg:grid-cols-[1.2fr,0.8fr] lg:p-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-primary">
              <Crown className="h-4 w-4" />
              Melhor custo-beneficio
            </div>
            <h2 className="font-display text-3xl leading-tight text-white sm:text-4xl">
              O Creator recebe o destaque porque e o plano que melhor equilibra
              volume, automacao, fila prioritaria e margem do negocio.
            </h2>
            <p className="max-w-2xl text-base leading-8 text-white/72">
              Ele reduz o custo por exportacao, amplia clipes e legendas mensais
              e mantem o usuario dentro do SmartClip por mais tempo com projetos
              ilimitados e reaplicacao de configuracoes.
            </p>
          </div>

          <div className="grid gap-4 rounded-[1.75rem] border border-white/10 bg-black/20 p-6">
            <div className="flex items-center justify-between border-b border-white/8 pb-4">
              <div>
                <p className="text-sm text-muted-foreground">Quando vale subir do Starter</p>
                <p className="mt-1 font-display text-2xl text-white">Ao passar de 25 automacoes</p>
              </div>
              <ArrowUpRight className="h-6 w-6 text-primary" />
            </div>
            <ul className="space-y-3 text-sm leading-7 text-white/80">
              <li>Exportacoes ilimitadas para rotina sem ansiedade.</li>
              <li>120 clipes automaticos e 120 legendas por mes.</li>
              <li>Projetos ilimitados, duplicacao e multiplas saidas.</li>
            </ul>
            <Button asChild className="w-full">
              <Link href="/pricing">Comparar Free, Starter, Creator e Pro</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
