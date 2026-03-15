import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SectionHeading } from "@/components/layout/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { blogPosts } from "@/services/blog";

export function BlogHighlights() {
  const featuredPosts = blogPosts.slice(0, 3);

  return (
    <section className="container py-16">
      <SectionHeading
        eyebrow="SEO e blog"
        title="Conteudo estruturado para puxar usuario da busca ate a ferramenta"
        description="Clusters, links internos, schema markup e CTAs comerciais preparados para transformar trafego organico em uso recorrente."
      />

      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {featuredPosts.map((post) => (
          <Card className="border-white/8 bg-white/[0.03]" key={post.slug}>
            <CardContent className="flex h-full flex-col gap-4 p-6">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-primary/80">
                <span>{post.category}</span>
                <span className="text-white/40">{post.readingTime}</span>
              </div>
              <div className="space-y-3">
                <h3 className="font-display text-2xl text-white">{post.title}</h3>
                <p className="text-sm leading-7 text-muted-foreground">{post.excerpt}</p>
              </div>
              <Link
                className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-white transition hover:text-primary"
                href={`/blog/${post.slug}`}
              >
                Ler artigo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
