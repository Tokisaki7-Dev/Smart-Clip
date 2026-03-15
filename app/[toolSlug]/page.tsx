import { notFound } from "next/navigation";

import { createMetadata } from "@/lib/metadata";
import { toolDefinitions, getToolBySlug } from "@/services/tools";

import { JsonLd } from "@/components/seo/json-ld";
import { ToolPage } from "@/components/tool/tool-page";

interface ToolRoutePageProps {
  params: Promise<{ toolSlug: string }>;
}

export async function generateStaticParams() {
  return toolDefinitions.map((tool) => ({ toolSlug: tool.slug }));
}

export async function generateMetadata({ params }: ToolRoutePageProps) {
  const { toolSlug } = await params;
  const tool = getToolBySlug(toolSlug);

  if (!tool) {
    return {};
  }

  return createMetadata({
    title: tool.seoTitle,
    description: tool.seoDescription,
    path: `/${tool.slug}`
  });
}

export default async function ToolRoutePage({ params }: ToolRoutePageProps) {
  const { toolSlug } = await params;
  const tool = getToolBySlug(toolSlug);

  if (!tool) {
    notFound();
  }

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: tool.title,
          applicationCategory: "MultimediaApplication",
          operatingSystem: "Web",
          description: tool.seoDescription
        }}
      />
      <ToolPage tool={tool} />
    </>
  );
}
