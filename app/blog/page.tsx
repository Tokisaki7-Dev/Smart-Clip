import { createMetadata } from "@/lib/metadata";
import { getPublishedBlogPosts } from "@/services/blog-data";

import { AdsenseSlot } from "@/components/ads/adsense-slot";
import { BlogCard } from "@/components/blog/blog-card";
import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/layout/section-heading";
import { blogCategories } from "@/services/blog";

export const metadata = createMetadata({
  title: "Blog",
  description:
    "Blog com clusters SEO, categorias e links internos para puxar trafego qualificado para as ferramentas do SmartClip.",
  path: "/blog"
});

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();

  return (
    <PageShell className="space-y-12">
      <SectionHeading
        eyebrow="Blog"
        title="Base de crescimento organico para clusters comerciais e educacionais"
        description="O blog foi preparado para crescer com categorias, links internos, schema markup e CTAs que puxam o leitor para a ferramenta correta."
      />

      <div className="flex flex-wrap gap-3">
        {blogCategories.map((category) => (
          <span
            className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/75"
            key={category}
          >
            {category}
          </span>
        ))}
      </div>

      <AdsenseSlot label="Blog topo" />

      <div className="grid gap-4 lg:grid-cols-2">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>

      <AdsenseSlot label="Blog meio" />
      <AdsenseSlot label="Blog fim" />
    </PageShell>
  );
}
