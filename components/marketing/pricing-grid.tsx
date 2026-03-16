import Link from "next/link";
import { Check, Sparkles } from "lucide-react";

import { getOptionalUser } from "@/lib/supabase/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { plans } from "@/services/plans";

interface PricingGridProps {
  compact?: boolean;
}

export async function PricingGrid({ compact = false }: PricingGridProps) {
  const user = await getOptionalUser();

  return (
    <div className="grid gap-4 xl:grid-cols-4">
      {plans.map((plan) => (
        <Card
          className={[
            "relative overflow-hidden border-white/10 bg-white/[0.035]",
            plan.highlighted
              ? "border-primary/30 bg-[radial-gradient(circle_at_top,rgba(34,224,255,0.15),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] shadow-glow"
              : ""
          ].join(" ")}
          key={plan.id}
        >
          {plan.highlighted ? (
            <div className="absolute right-5 top-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              {plan.badge}
            </div>
          ) : null}

          <CardContent className="flex h-full flex-col gap-6 p-6">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-primary/80">
                {plan.name}
              </p>
              <div className="mt-4 flex items-end gap-2">
                <span className="font-display text-5xl leading-none text-white">
                  {plan.price}
                </span>
                {plan.name !== "Free" ? (
                  <span className="pb-1 text-sm text-white/50">/mes</span>
                ) : null}
              </div>
              {plan.trial ? (
                <p className="mt-3 text-sm text-success">{plan.trial}</p>
              ) : null}
              <p className="mt-4 text-sm leading-7 text-white/65">{plan.description}</p>
              <p className="mt-3 rounded-[1.25rem] border border-white/8 bg-black/20 px-4 py-3 text-sm leading-7 text-white/58">
                {plan.audience}
              </p>
            </div>

            <div className="space-y-3 rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4">
              {plan.quotas.map((quota) => (
                <div className="flex items-center justify-between gap-4 text-sm" key={quota.label}>
                  <span className="text-white/50">{quota.label}</span>
                  <span className="font-medium text-white">{quota.value}</span>
                </div>
              ))}
            </div>

            <Button asChild className="w-full" variant={plan.highlighted ? "primary" : "secondary"}>
              <Link
                href={
                  plan.id === "free"
                    ? user
                      ? "/dashboard"
                      : "/signup"
                    : "/billing"
                }
              >
                {plan.id === "free"
                  ? user
                    ? "Abrir dashboard"
                    : plan.ctaLabel
                  : user
                    ? `Assinar ${plan.name}`
                    : plan.ctaLabel}
              </Link>
            </Button>

            <div className="space-y-4">
              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.24em] text-white/42">
                  Premium e conversao
                </p>
                <div className="space-y-3">
                  {plan.premiumUnlocks.map((item) => (
                    <div className="flex gap-3 text-sm text-white/82" key={item}>
                      <Check className="mt-0.5 h-4 w-4 text-primary" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {!compact ? (
                <div>
                  <p className="mb-3 text-xs uppercase tracking-[0.24em] text-white/42">
                    Ganchos de retencao
                  </p>
                  <div className="space-y-3">
                    {plan.retentionHooks.map((item) => (
                      <div className="flex gap-3 text-sm text-white/60" key={item}>
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
