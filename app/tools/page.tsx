import { createMetadata } from "@/lib/metadata";

import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/layout/section-heading";
import { ToolGrid } from "@/components/marketing/tool-grid";
import { CtaStrip } from "@/components/marketing/cta-strip";

export const metadata = createMetadata({
  title: "Ferramentas",
  description:
    "Ferramentas de corte, compressao, extracao de audio, conversao e formatos prontos para redes sociais.",
  path: "/tools"
});

export default function ToolsPage() {
  return (
    <PageShell className="space-y-12">
      <SectionHeading
        eyebrow="Ferramentas"
        title="Paginas comerciais de alta intencao para crescer com SEO e converter em uso"
        description="Cada rota leva o usuario de uma dor bem definida para um fluxo de upload simples, com CTA contextual para recursos premium quando fizer sentido."
      />
      <ToolGrid />
      <CtaStrip
        description="Use presets prontos para redes, exportacao controlada no gratis e sinais de upgrade elegantes quando o video estiver validado."
        primaryHref="/signup"
        primaryLabel="Testar ferramentas"
        secondaryHref="/pricing"
        secondaryLabel="Ver planos"
        title="Suba um video e deixe o SmartClip encurtar sua rotina"
      />
    </PageShell>
  );
}
