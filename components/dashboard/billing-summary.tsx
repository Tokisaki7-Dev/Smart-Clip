import { CreditCard, Wallet } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { billingSnapshot } from "@/services/billing";

export function BillingSummaryPanel() {
  return (
    <Card className="border-white/8 bg-white/[0.03]">
      <CardContent className="space-y-6 p-6">
        <div>
          <h3 className="font-display text-2xl text-white">Billing e creditos</h3>
          <p className="text-sm text-muted-foreground">
            Cobrança preparada para assinaturas, trial, cancelamento no painel e creditos avulsos.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-5">
            <div className="flex items-center gap-3 text-primary">
              <CreditCard className="h-5 w-5" />
              <span className="text-sm uppercase tracking-[0.2em]">Assinatura</span>
            </div>
            <h4 className="mt-4 font-display text-2xl text-white">
              {billingSnapshot.currentPlan}
            </h4>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              {billingSnapshot.trialMessage}
            </p>
            <p className="mt-3 text-sm text-white/80">
              Proxima cobranca: {billingSnapshot.nextCharge}
            </p>
            <p className="mt-1 text-sm text-white/60">
              {billingSnapshot.paymentMethod}
            </p>
          </div>

          <div className="rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-5">
            <div className="flex items-center gap-3 text-primary">
              <Wallet className="h-5 w-5" />
              <span className="text-sm uppercase tracking-[0.2em]">Carteira</span>
            </div>
            <h4 className="mt-4 font-display text-2xl text-white">
              {billingSnapshot.creditBalance} creditos disponiveis
            </h4>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              {billingSnapshot.nextRecommendedAction}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
