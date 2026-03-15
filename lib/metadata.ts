import type { Metadata } from "next";

import { siteConfig } from "@/lib/site-config";
import { absoluteUrl } from "@/lib/utils";

interface MetadataOptions {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
}

export function createMetadata({
  title,
  description,
  path = "/",
  keywords = []
}: MetadataOptions): Metadata {
  return {
    title,
    description,
    keywords,
    metadataBase: new URL(absoluteUrl("/")),
    alternates: {
      canonical: absoluteUrl(path)
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      siteName: siteConfig.name,
      locale: "pt_BR",
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title,
      description
    }
  };
}
