import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { BlogPost } from "@/types";

import { Card, CardContent } from "@/components/ui/card";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Card className="border-white/8 bg-white/[0.03]">
      <CardContent className="flex h-full flex-col gap-4 p-6">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-primary/80">
          <span>{post.category}</span>
          <span className="text-white/40">{post.readingTime}</span>
        </div>
        <div>
          <h3 className="font-display text-2xl text-white">{post.title}</h3>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">{post.excerpt}</p>
        </div>
        <Link
          className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-white transition hover:text-primary"
          href={`/blog/${post.slug}`}
        >
          Ler agora
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
}
