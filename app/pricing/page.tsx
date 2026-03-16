import { createMetadata } from "@/lib/metadata";
import { getOptionalUser } from "@/lib/supabase/auth";

import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/layout/section-heading";
import { CtaStrip } from "@/components/marketing/cta-strip";
import { FaqSection } from "@/components/marketing/faq-section";
import { PricingGrid } from "@/components/marketing/pricing-grid";
import { Card, CardContent } from "@/components/ui/card";
import { automationPacks } from "@/services/billing";

export const metadata = createMetadata({
  title: "Planos e creditos",
  description:
    "Compare Free, Starter, Creator e Pro, veja creditos avulsos e entenda quando cada plano faz sentido.",
  path: "/pricing"
});

export default async function PricingPage() {
  const user = await getOptionalUser();

  return (
    <>
      <PageShell className="space-y-12">
        <SectionHeading
          eyebrow="Pricing"
          title="Planos pensados para reter no gratis, converter com clareza e aumentar lucro sem estragar a experiencia"
          description="O redesenho do produto reforca o Creator como melhor custo-beneficio, mantem o Free forte e usa creditos avulsos para capturar quem nao quer assinatura recorrente."
        />
        <PricingGrid />

        <section className="space-y-6">
          <SectionHeading
            eyebrow="Creditos avulsos"
            title="Receita complementar para uso eventual"
            description="Pacotes avulsos capturam quem nao quer assinatura, mas ainda precisa de automacoes premium ou exportacoes extras."
          />
          <div className="grid gap-4 lg:grid-cols-3">
            {automationPacks.map((pack) => (
              <Card className="border-white/8 bg-white/[0.03]" key={pack.id}>
                <CardContent className="space-y-4 p-6">
                  <h3 className="font-display text-2xl text-white">{pack.name}</h3>
                  <p className="text-3xl font-semibold text-primary">{pack.price}</p>
                  <ul className="space-y-3 text-sm leading-7 text-muted-foreground">
                    {pack.useCases.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <CtaStrip
          description="O Starter reduz atrito, o Creator vira melhor custo-beneficio quando o uso cresce e os creditos avulsos capturam picos eventuais."
          primaryHref={user ? "/billing" : "/signup"}
          primaryLabel={user ? "Abrir billing" : "Criar conta"}
          secondaryHref="/billing"
          secondaryLabel="Ver billing"
          title="Comece no gratis e suba quando o valor aparecer"
        />
      </PageShell>
      <FaqSection />
    </>
  );
}
