import { notFound } from "next/navigation";

import { createMetadata } from "@/lib/metadata";
import { absoluteUrl } from "@/lib/utils";
import { blogPosts } from "@/services/blog";
import { getPublishedBlogPostBySlug } from "@/services/blog-data";

import { PageShell } from "@/components/layout/page-shell";
import { CtaStrip } from "@/components/marketing/cta-strip";
import { JsonLd } from "@/components/seo/json-ld";
import { ArticleLayout } from "@/components/blog/article-layout";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);

  if (!post) {
    return {};
  }

  return createMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    keywords: post.keywords
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const primaryRelatedTool = post.relatedTools[0] || "cortar-video";

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.description,
          datePublished: "2026-03-15",
          author: {
            "@type": "Organization",
            name: "SmartClip"
          },
          mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`)
        }}
      />
      <PageShell className="space-y-10">
        <ArticleLayout post={post} />
        <CtaStrip
          description="Leia o conteudo, abra a ferramenta relacionada e teste o valor premium com limites controlados no plano gratis."
          primaryHref={`/${primaryRelatedTool}`}
          primaryLabel="Abrir ferramenta relacionada"
          secondaryHref="/pricing"
          secondaryLabel="Entender planos"
          title="Use o conteudo para publicar mais rapido, nao para acumular teoria"
        />
      </PageShell>
    </>
  );
}
