import { createMetadata } from "@/lib/metadata";

import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/layout/section-heading";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = createMetadata({
  title: "Privacidade",
  description: "Politica de privacidade base do SmartClip para dados, arquivos e billing.",
  path: "/privacy"
});

export default function PrivacyPage() {
  return (
    <PageShell className="space-y-10">
      <SectionHeading
        eyebrow="Privacidade"
        title="Como dados, uploads e eventos de pagamento sao tratados"
        description="Texto base para orientar coleta, processamento, retencao e seguranca no ecossistema SmartClip com Supabase e PagBank."
      />
      <Card className="border-white/8 bg-white/[0.03]">
        <CardContent className="space-y-4 p-8 text-sm leading-8 text-muted-foreground">
          <p>Coletamos dados necessarios para autenticacao, billing, suporte e operacao das ferramentas.</p>
          <p>Uploads e arquivos processados devem respeitar a retencao do plano contratado.</p>
          <p>Eventos de pagamento, creditos e logs tecnicos ficam estruturados para auditoria e conciliacao.</p>
        </CardContent>
      </Card>
    </PageShell>
  );
}
