import type { MetadataRoute } from "next";

import { blogPosts } from "@/services/blog";
import { seoClusters } from "@/services/seo";
import { toolDefinitions } from "@/services/tools";
import { absoluteUrl } from "@/lib/utils";

const staticRoutes = [
  "/",
  "/pricing",
  "/tools",
  "/blog",
  "/billing",
  "/dashboard",
  "/help",
  "/contact",
  "/login",
  "/signup",
  "/privacy",
  "/terms",
  "/cookies",
  "/guias"
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = staticRoutes.map((route) => ({
    url: absoluteUrl(route),
    lastModified: new Date()
  }));

  const toolEntries = toolDefinitions.map((tool) => ({
    url: absoluteUrl(`/${tool.slug}`),
    lastModified: new Date()
  }));

  const blogEntries = blogPosts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date()
  }));

  const clusterEntries = seoClusters.map((cluster) => ({
    url: absoluteUrl(`/guias/${cluster.slug}`),
    lastModified: new Date()
  }));

  return [...staticEntries, ...toolEntries, ...blogEntries, ...clusterEntries];
}
