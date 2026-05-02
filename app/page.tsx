import { createMetadata } from "@/lib/metadata";

import { HeroSection } from "@/components/marketing/hero-section";
import { ToolsShowcase } from "@/components/marketing/tools-showcase";
import { FaqSection } from "@/components/marketing/faq-section";
import { FreeValueSection } from "@/components/marketing/free-value-section";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { PopularSearches } from "@/components/marketing/popular-searches";
import { JsonLd } from "@/components/seo/json-ld";
import { PageShell } from "@/components/layout/page-shell";

export const metadata = createMetadata({
  title: "SmartClip - Edite Seus Vídeos em Segundos",
  description:
    "Ferramentas poderosas de edição de vídeo com IA para cortar, compactar, adicionar legendas e melhorar a qualidade em tempo real.",
  path: "/",
  keywords: [
    "cortar video online",
    "legenda automatica",
    "video para reels",
    "compressao de video",
    "transformar video em clipe viral",
    "gerar varios clipes automaticos",
    "gerar ganchos de video",
    "podcast para clipes",
    "aula para clipes",
    "depoimento para anuncio",
    "clipe com legenda automatica"
  ]
});

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "SmartClip",
          applicationCategory: "MultimediaApplication",
          operatingSystem: "Web",
          description:
            "Ferramentas poderosas de edição de vídeo com IA para cortar, compactar, adicionar legendas e melhorar a qualidade em tempo real."
        }}
      />

      <PageShell>
        <HeroSection />
        <ToolsShowcase />
        <HowItWorks />
        <FreeValueSection />
        <PopularSearches />
        <FaqSection />
      </PageShell>
    </>
  );
}
      <ToolGrid />
      <PageShell className="pt-0">
        <AdsenseSlot
          className="max-w-4xl"
          label="Home entre secoes"
          slotKey="home"
        />
      </PageShell>
      <HowItWorks />
      <FreeValueSection />
      <FaqSection />
      <BlogHighlights />
    </>
  );
}
