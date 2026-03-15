import Link from "next/link";
import { notFound } from "next/navigation";

import { createMetadata } from "@/lib/metadata";
import { getSeoClusterBySlug, seoClusters } from "@/services/seo";

import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/layout/section-heading";
import { CtaStrip } from "@/components/marketing/cta-strip";
import { JsonLd } from "@/components/seo/json-ld";
import { Card, CardContent } from "@/components/ui/card";

interface ClusterPageProps {
  params: Promise<{ clusterSlug: string }>;
}

export async function generateStaticParams() {
  return seoClusters.map((cluster) => ({ clusterSlug: cluster.slug }));
}

export async function generateMetadata({ params }: ClusterPageProps) {
  const { clusterSlug } = await params;
  const cluster = getSeoClusterBySlug(clusterSlug);

  if (!cluster) {
    return {};
  }

  return createMetadata({
    title: cluster.title,
    description: cluster.description,
    path: `/guias/${cluster.slug}`,
    keywords: cluster.keywords
  });
}

export default async function ClusterPage({ params }: ClusterPageProps) {
  const { clusterSlug } = await params;
  const cluster = getSeoClusterBySlug(clusterSlug);

  if (!cluster) {
    notFound();
  }

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: cluster.title,
          description: cluster.description
        }}
      />

      <PageShell className="space-y-12">
        <SectionHeading
          eyebrow="Cluster"
          title={cluster.title}
          description={`${cluster.description} ${cluster.intent}`}
        />

        <div className="grid gap-4 lg:grid-cols-2">
          {cluster.relatedRoutes.map((route) => (
            <Card className="border-white/8 bg-white/[0.03]" key={route}>
              <CardContent className="space-y-3 p-6">
                <p className="text-sm text-primary">Rota relacionada</p>
                <h2 className="font-display text-2xl text-white">{route}</h2>
                <Link className="text-sm font-medium text-white hover:text-primary" href={route}>
                  Abrir pagina
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {cluster.faqs.map((faq) => (
            <Card className="border-white/8 bg-white/[0.03]" key={faq.question}>
              <CardContent className="space-y-3 p-6">
                <h3 className="font-display text-xl text-white">{faq.question}</h3>
                <p className="text-sm leading-7 text-muted-foreground">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <CtaStrip
          description="Use o cluster para organizar producao de conteudo, interligar rotas comerciais e puxar o usuario para a ferramenta certa."
          primaryHref={cluster.relatedRoutes[0]}
          primaryLabel="Abrir principal ferramenta"
          secondaryHref="/blog"
          secondaryLabel="Ver artigos"
          title="Conteudo organico forte precisa terminar em acao"
        />
      </PageShell>
    </>
  );
}
