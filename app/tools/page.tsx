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
        title="Ferramentas organizadas para atrair busca, resolver dores claras e puxar mais uso recorrente"
        description="O catalogo agora mistura rotas evergreen, ferramentas de viralizacao, formatos sociais e conversoes de altissima utilidade. A ideia e simples: ser facil de usar, muito pratico e dificil de abandonar."
      />
      <ToolGrid />
      <CtaStrip
        description="Comece em uma ferramenta, descubra outras rotas relacionadas e leve o melhor formato para cada plataforma sem recomecar do zero."
        primaryHref="/video-para-clipe-com-legenda-automatica#smartclip-uploader"
        primaryLabel="Testar ferramentas"
        secondaryHref="/pricing"
        secondaryLabel="Ver planos"
        title="Suba um video e deixe o SmartClip encurtar sua rotina"
      />
    </PageShell>
  );
}
