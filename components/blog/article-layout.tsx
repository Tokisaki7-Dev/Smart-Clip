import Link from "next/link";

import type { BlogPost } from "@/types";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getToolBySlug } from "@/services/tools";

interface ArticleLayoutProps {
  post: BlogPost;
}

export function ArticleLayout({ post }: ArticleLayoutProps) {
  return (
    <article className="grid gap-8 lg:grid-cols-[1fr,320px]">
      <div className="space-y-6">
        <div className="space-y-4">
          <Badge variant="primary">{post.category}</Badge>
          <h1 className="font-display text-4xl leading-tight text-white sm:text-5xl">
            {post.title}
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
            {post.description}
          </p>
          <p className="text-sm uppercase tracking-[0.24em] text-white/45">
            {post.publishedAt} • {post.readingTime}
          </p>
        </div>

        <div className="space-y-10">
          {post.sections.map((section) => (
            <section className="space-y-4" key={section.heading}>
              <h2 className="font-display text-2xl text-white">{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p className="text-base leading-8 text-white/78" key={paragraph}>
                  {paragraph}
                </p>
              ))}
              {section.bullets ? (
                <ul className="space-y-3 rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-6 text-sm leading-7 text-white/72">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </div>

      <aside className="space-y-4">
        <Card className="border-white/8 bg-white/[0.03]">
          <CardContent className="space-y-4 p-6">
            <h3 className="font-display text-xl text-white">Ferramentas relacionadas</h3>
            {post.relatedTools.map((slug) => {
              const tool = getToolBySlug(slug);
              if (!tool) {
                return null;
              }

              return (
                <Link
                  className="block rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-4 transition hover:border-primary/40"
                  href={`/${tool.slug}`}
                  key={tool.slug}
                >
                  <p className="text-sm text-primary">{tool.kicker}</p>
                  <p className="mt-2 font-medium text-white">{tool.title}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {tool.shortDescription}
                  </p>
                </Link>
              );
            })}
          </CardContent>
        </Card>
      </aside>
    </article>
  );
}
