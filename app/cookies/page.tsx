import { createMetadata } from "@/lib/metadata";

import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/layout/section-heading";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = createMetadata({
  title: "Cookies",
  description: "Politica de cookies base do SmartClip.",
  path: "/cookies"
});

export default function CookiesPage() {
  return (
    <PageShell className="space-y-10">
      <SectionHeading
        eyebrow="Cookies"
        title="Cookies para sessao, analytics e continuidade da experiencia"
        description="A base do SmartClip separa cookies essenciais de analytics e eventos ligados a onboarding, billing e retorno ao dashboard."
      />
      <Card className="border-white/8 bg-white/[0.03]">
        <CardContent className="space-y-4 p-8 text-sm leading-8 text-muted-foreground">
          <p>Cookies essenciais mantem autenticacao, seguranca e preferencia de sessao.</p>
          <p>Cookies analiticos podem medir onboarding, retorno ao dashboard e conversao de planos.</p>
          <p>Qualquer uso publicitario deve permanecer discreto e fora de pontos criticos da jornada.</p>
        </CardContent>
      </Card>
    </PageShell>
  );
}
