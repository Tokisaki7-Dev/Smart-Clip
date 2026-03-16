import { createMetadata } from "@/lib/metadata";

import { AdsenseSlot } from "@/components/ads/adsense-slot";
import { BlogHighlights } from "@/components/marketing/blog-highlights";
import { FaqSection } from "@/components/marketing/faq-section";
import { FreeValueSection } from "@/components/marketing/free-value-section";
import { Hero } from "@/components/marketing/hero";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { PremiumHighlights } from "@/components/marketing/premium-highlights";
import { PricingGrid } from "@/components/marketing/pricing-grid";
import { ToolGrid } from "@/components/marketing/tool-grid";
import { UpgradePath } from "@/components/marketing/upgrade-path";
import { JsonLd } from "@/components/seo/json-ld";
import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/layout/section-heading";

export const metadata = createMetadata({
  title: "SmartClip",
  description:
    "Transforme videos em clipes 1080p com legenda automatica, formatos sociais e fluxo premium para TikTok, Shorts, Reels e Stories.",
  path: "/",
  keywords: [
    "cortar video online",
    "legenda automatica",
    "video para reels",
    "compressao de video",
    "transformar video em clipe viral",
    "gerar varios clipes automaticos",
    "podcast para clipes",
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
            "Transforme seus videos em clipes prontos com legenda automatica, 1080p e formatos para redes sociais em poucos cliques."
        }}
      />

      <Hero />
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
      <PremiumHighlights />
      <section className="container py-16">
        <SectionHeading
          eyebrow="Planos"
          title="Uma escada de valor mais clara para crescer do primeiro uso ate operacao intensa"
          description="O Free agora impressiona mais, o Starter remove as primeiras travas, o Creator continua sendo o ponto de melhor margem e o Pro cobre volume pesado com prioridade maxima."
        />
        <div className="mt-10">
          <PricingGrid />
        </div>
      </section>
      <UpgradePath />
      <FaqSection />
      <BlogHighlights />
    </>
  );
}
