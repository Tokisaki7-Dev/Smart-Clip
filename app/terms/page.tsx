import { createMetadata } from "@/lib/metadata";

import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/layout/section-heading";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = createMetadata({
  title: "Termos",
  description: "Termos de uso base do SmartClip.",
  path: "/terms"
});

export default function TermsPage() {
  return (
    <PageShell className="space-y-10">
      <SectionHeading
        eyebrow="Termos"
        title="Regras de uso, assinatura e responsabilidade"
        description="Base legal para uso das ferramentas, limites do plano, creditos avulsos, cancelamento e comportamento aceitavel."
      />
      <Card className="border-white/8 bg-white/[0.03]">
        <CardContent className="space-y-4 p-8 text-sm leading-8 text-muted-foreground">
          <p>O usuario e responsavel pelos videos enviados e pelos direitos relacionados aos arquivos.</p>
          <p>Assinaturas, trials e creditos seguem a politica de billing informada no checkout e no painel.</p>
          <p>Recursos beta e processamento pesado podem variar conforme fila, plano e manutencao da infraestrutura.</p>
        </CardContent>
      </Card>
    </PageShell>
  );
}
