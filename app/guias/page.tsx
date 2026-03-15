import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { createMetadata } from "@/lib/metadata";
import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/layout/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { seoClusters } from "@/services/seo";

export const metadata = createMetadata({
  title: "Guias SEO",
  description:
    "Clusters de conteudo do SmartClip com paginas comerciais e educacionais interligadas.",
  path: "/guias"
});

export default function GuidesPage() {
  return (
    <PageShell className="space-y-12">
      <SectionHeading
        eyebrow="Clusters SEO"
        title="Paginas maes para crescer em intencoes comerciais relevantes"
        description="Cada cluster organiza as rotas mais fortes do produto, FAQs e links internos para aprofundar cobertura organica."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {seoClusters.map((cluster) => (
          <Card className="border-white/8 bg-white/[0.03]" key={cluster.slug}>
            <CardContent className="space-y-4 p-6">
              <h2 className="font-display text-2xl text-white">{cluster.title}</h2>
              <p className="text-sm leading-7 text-muted-foreground">
                {cluster.description}
              </p>
              <Link
                className="inline-flex items-center gap-2 text-sm font-medium text-white transition hover:text-primary"
                href={`/guias/${cluster.slug}`}
              >
                Abrir cluster
                <ArrowRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
