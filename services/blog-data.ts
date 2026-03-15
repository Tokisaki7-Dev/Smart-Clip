import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { blogPosts } from "@/services/blog";
import type { BlogPost, BlogSection } from "@/types";

function isValidSectionArray(content: unknown): content is BlogSection[] {
  return (
    Array.isArray(content) &&
    content.every(
      (section) =>
        typeof section === "object" &&
        section !== null &&
        "heading" in section &&
        "paragraphs" in section
    )
  );
}

function mapRowToPost(row: {
  slug: string;
  title: string;
  excerpt: string;
  seo_description: string | null;
  category: string;
  published_at: string | null;
  content: unknown;
}): BlogPost {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    description: row.seo_description || row.excerpt,
    category: row.category,
    publishedAt: row.published_at || "",
    readingTime: "5 min",
    keywords: [row.category.toLowerCase(), row.slug.replaceAll("-", " ")],
    sections: isValidSectionArray(row.content) ? row.content : [],
    relatedTools: []
  };
}

export async function getPublishedBlogPosts() {
  if (!isSupabaseConfigured()) {
    return blogPosts;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("slug, title, excerpt, seo_description, category, published_at, content")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (error || !data || data.length === 0) {
    return blogPosts;
  }

  return data.map(mapRowToPost);
}

export async function getPublishedBlogPostBySlug(slug: string) {
  if (!isSupabaseConfigured()) {
    return blogPosts.find((post) => post.slug === slug) || null;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("slug, title, excerpt, seo_description, category, published_at, content")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error || !data) {
    return blogPosts.find((post) => post.slug === slug) || null;
  }

  return mapRowToPost(data);
}
