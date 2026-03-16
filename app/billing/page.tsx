import { createMetadata } from "@/lib/metadata";
import { getOptionalUser } from "@/lib/supabase/auth";
import { getBillingSummary } from "@/services/dashboard-data";

import { BillingActions } from "@/components/billing/billing-actions";
import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/layout/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { automationPacks, paymentMethods } from "@/services/billing";

export const metadata = createMetadata({
  title: "Billing",
  description:
    "Base de billing com trial, cancelamento pelo painel, creditos avulsos e metodos de pagamento do PagBank.",
  path: "/billing"
});

export default async function BillingPage() {
  const [billingSummary, user] = await Promise.all([getBillingSummary(), getOptionalUser()]);

  return (
    <PageShell className="space-y-12">
      <SectionHeading
        eyebrow="Billing"
        title="Assinaturas, trial de 30 dias e creditos avulsos no mesmo fluxo"
        description="A integracao foi preparada para PagBank com checkout transparente, metodos locais e webhooks para manter assinatura, tentativas e creditos sincronizados."
      />

      <div className="grid gap-4 lg:grid-cols-[1fr,0.85fr]">
        <Card className="border-white/8 bg-white/[0.03]">
          <CardContent className="space-y-5 p-6">
            <h2 className="font-display text-2xl text-white">Metodos de pagamento</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {paymentMethods.map((method) => (
                <div
                  className="rounded-[1.25rem] border border-white/8 bg-white/[0.03] px-4 py-4 text-sm text-white/82"
                  key={method}
                >
                  {method}
                </div>
              ))}
            </div>
            <p className="text-sm leading-7 text-muted-foreground">
              O Starter contem trial de 30 dias com cartao obrigatorio e
              cancelamento self-service. Creator e Pro seguem a mesma base com
              upgrades e downgrades preparados para o painel.
            </p>
            <div className="rounded-[1.25rem] border border-primary/20 bg-primary/5 p-4 text-sm leading-7 text-white/80">
              <p>Plano atual: {billingSummary.currentPlan}</p>
              <p>{billingSummary.trialMessage}</p>
              <p>Proxima cobranca: {billingSummary.nextCharge}</p>
              <p>{billingSummary.paymentMethod}</p>
            </div>
            <BillingActions
              currentPlan={billingSummary.currentPlan}
              initialEmail={user?.email}
              packs={automationPacks}
            />
          </CardContent>
        </Card>

        <Card className="border-white/8 bg-white/[0.03]">
          <CardContent className="space-y-5 p-6">
            <h2 className="font-display text-2xl text-white">Creditos premium</h2>
            <div className="rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-4 text-sm text-white/82">
              Carteira atual: {billingSummary.creditBalance} creditos
            </div>
            {automationPacks.map((pack) => (
              <div
                className="rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-4"
                key={pack.id}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-white">{pack.name}</h3>
                  <span className="text-primary">{pack.price}</span>
                </div>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  {pack.useCases.join(" • ")}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
