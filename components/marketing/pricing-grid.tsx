import Link from "next/link";
import { Check, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { plans } from "@/services/plans";

interface PricingGridProps {
  compact?: boolean;
}

export function PricingGrid({ compact = false }: PricingGridProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-4">
      {plans.map((plan) => (
        <Card
          className={[
            "relative overflow-hidden border-white/8 bg-gradient-to-b from-white/[0.05] to-white/[0.02]",
            plan.highlighted ? "border-primary/40 shadow-glow" : ""
          ].join(" ")}
          key={plan.id}
        >
          {plan.highlighted ? (
            <div className="absolute right-5 top-5 inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
              <Sparkles className="h-3.5 w-3.5" />
              {plan.badge}
            </div>
          ) : null}

          <CardContent className="flex h-full flex-col gap-6 p-6">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-primary/80">
                {plan.name}
              </p>
              <div className="mt-4 flex items-end gap-2">
                <span className="font-display text-4xl text-white">{plan.price}</span>
                {plan.name !== "Free" ? (
                  <span className="pb-1 text-sm text-muted-foreground">/mes</span>
                ) : null}
              </div>
              {plan.trial ? (
                <p className="mt-3 text-sm text-success">{plan.trial}</p>
              ) : null}
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                {plan.description}
              </p>
            </div>

            <div className="space-y-3">
              {plan.quotas.map((quota) => (
                <div className="flex items-center justify-between text-sm" key={quota.label}>
                  <span className="text-muted-foreground">{quota.label}</span>
                  <span className="font-medium text-white">{quota.value}</span>
                </div>
              ))}
            </div>

            <Button asChild className="w-full" variant={plan.highlighted ? "primary" : "secondary"}>
              <Link href="/signup">{plan.ctaLabel}</Link>
            </Button>

            <div className="space-y-4">
              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.24em] text-white/60">
                  Premium e conversao
                </p>
                <div className="space-y-3">
                  {plan.premiumUnlocks.map((item) => (
                    <div className="flex gap-3 text-sm text-white/85" key={item}>
                      <Check className="mt-0.5 h-4 w-4 text-primary" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {!compact ? (
                <div>
                  <p className="mb-3 text-xs uppercase tracking-[0.24em] text-white/60">
                    Ganchos de retencao
                  </p>
                  <div className="space-y-3">
                    {plan.retentionHooks.map((item) => (
                      <div className="flex gap-3 text-sm text-muted-foreground" key={item}>
                        <Check className="mt-0.5 h-4 w-4 text-success" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
