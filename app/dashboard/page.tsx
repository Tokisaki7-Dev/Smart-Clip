import { redirect } from "next/navigation";

import { createMetadata } from "@/lib/metadata";
import { isSupabaseConfigured } from "@/lib/env";
import { getOptionalUser } from "@/lib/supabase/auth";

import { BillingSummaryPanel } from "@/components/dashboard/billing-summary";
import { ProjectList } from "@/components/dashboard/project-list";
import { RecentAssets } from "@/components/dashboard/recent-assets";
import { UpgradeBanner } from "@/components/dashboard/upgrade-banner";
import { UsageOverview } from "@/components/dashboard/usage-overview";
import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getBillingSummary, getDashboardSnapshot } from "@/services/dashboard-data";

export const metadata = createMetadata({
  title: "Dashboard",
  description:
    "Painel orientado a retorno com uso do dia, automacoes restantes, arquivos recentes, projetos e billing.",
  path: "/dashboard"
});

export default async function DashboardPage() {
  if (isSupabaseConfigured()) {
    const user = await getOptionalUser();
    if (!user) {
      redirect("/login?message=Entre para abrir seu dashboard.");
    }
  }

  const [snapshot, billingSummary] = await Promise.all([
    getDashboardSnapshot(),
    getBillingSummary()
  ]);

  return (
    <PageShell className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1fr,320px]">
        <Card className="border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,224,255,0.15),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))]">
          <CardContent className="space-y-5 p-6 lg:p-8">
            <Badge variant="primary">Dashboard de retencao</Badge>
            <div className="space-y-3">
              <h1 className="font-display text-4xl text-white">
                Ola, {snapshot.userName}. Seu ultimo preset foi {snapshot.lastPreset}.
              </h1>
              <p className="max-w-3xl text-base leading-8 text-muted-foreground">
                O painel foi pensado para trazer voce de volta com historico claro,
                repeticao de exportacoes, projetos recentes e CTAs elegantes para
                quando o valor premium fizer sentido.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="metric-chip">Projeto mais recente visivel</span>
              <span className="metric-chip">
                {snapshot.currentPlan === "free"
                  ? `${snapshot.fullHdRemaining} exportacoes 1080p restantes`
                  : "1080p liberado"}
              </span>
              <span className="metric-chip">
                {snapshot.currentPlan === "pro"
                  ? "Automacoes ilimitadas"
                  : `${Math.max(
                      0,
                      snapshot.monthlyAutoClipsLimit - snapshot.monthlyAutoClipsUsed
                    )} automacoes restantes`}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/[0.045] shadow-glow">
          <CardContent className="space-y-4 p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-primary">Seu plano</p>
            <h2 className="font-display text-3xl text-white">
              {snapshot.currentPlan.toUpperCase()}
            </h2>
            <p className="text-sm leading-7 text-muted-foreground">
              Exportacoes hoje: {snapshot.dailyExportsUsed} de{" "}
              {snapshot.currentPlan === "creator" || snapshot.currentPlan === "pro"
                ? "ilimitadas"
                : snapshot.dailyExportsLimit}
              . Clipes gratis restantes no mes:{" "}
              {snapshot.currentPlan === "pro"
                ? "ilimitados"
                : Math.max(0, snapshot.monthlyAutoClipsLimit - snapshot.monthlyAutoClipsUsed)}
              .
            </p>
          </CardContent>
        </Card>
      </div>

      <UsageOverview snapshot={snapshot} />
      <UpgradeBanner snapshot={snapshot} />
      <RecentAssets snapshot={snapshot} />
      <ProjectList snapshot={snapshot} />
      <BillingSummaryPanel summary={billingSummary} />
    </PageShell>
  );
}
