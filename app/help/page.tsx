import { createMetadata } from "@/lib/metadata";

import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/layout/section-heading";
import { Card, CardContent } from "@/components/ui/card";

const topics = [
  "Como subir um video e escolher o preset certo",
  "Como funciona o limite mensal de clipes e legendas",
  "Onde acompanhar trial, assinatura e creditos",
  "Como repetir ultima exportacao e salvar projetos"
];

export const metadata = createMetadata({
  title: "Ajuda",
  description: "Central de ajuda do SmartClip com foco em onboarding, uso recorrente e billing.",
  path: "/help"
});

export default function HelpPage() {
  return (
    <PageShell className="space-y-12">
      <SectionHeading
        eyebrow="Ajuda"
        title="Base de suporte para reduzir atrito e abandono"
        description="Explicacoes claras sobre upload, limites, billing e recursos premium diminuem friccao e deixam o usuario mais confiante para continuar."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {topics.map((topic) => (
          <Card className="border-white/8 bg-white/[0.03]" key={topic}>
            <CardContent className="p-6">
              <h2 className="font-display text-2xl text-white">{topic}</h2>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
