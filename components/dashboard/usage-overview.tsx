import { BarChart3, Captions, Repeat, WandSparkles } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import type { DashboardSnapshot } from "@/types";

interface UsageOverviewProps {
  snapshot: DashboardSnapshot;
}

export function UsageOverview({ snapshot }: UsageOverviewProps) {
  const isDailyUnlimited =
    snapshot.currentPlan === "creator" || snapshot.currentPlan === "pro";
  const isAutoClipUnlimited = snapshot.currentPlan === "pro";
  const isCaptionUnlimited = snapshot.currentPlan === "pro";

  const metricCards = [
    {
      label: "Exportacoes hoje",
      value: isDailyUnlimited
        ? `${snapshot.dailyExportsUsed}/∞`
        : `${snapshot.dailyExportsUsed}/${snapshot.dailyExportsLimit}`,
      progress: isDailyUnlimited
        ? 100
        : (snapshot.dailyExportsUsed / snapshot.dailyExportsLimit) * 100,
      icon: BarChart3
    },
    {
      label: "Clipes automaticos no mes",
      value: isAutoClipUnlimited
        ? `${snapshot.monthlyAutoClipsUsed}/∞`
        : `${snapshot.monthlyAutoClipsUsed}/${snapshot.monthlyAutoClipsLimit}`,
      progress: isAutoClipUnlimited
        ? 100
        : (snapshot.monthlyAutoClipsUsed / snapshot.monthlyAutoClipsLimit) * 100,
      icon: WandSparkles
    },
    {
      label: "Legendas no mes",
      value: isCaptionUnlimited
        ? `${snapshot.monthlyCaptionsUsed}/∞`
        : `${snapshot.monthlyCaptionsUsed}/${snapshot.monthlyCaptionsLimit}`,
      progress: isCaptionUnlimited
        ? 100
        : (snapshot.monthlyCaptionsUsed / snapshot.monthlyCaptionsLimit) * 100,
      icon: Captions
    },
    {
      label: "Ultimo preset salvo",
      value: snapshot.lastPreset,
      progress: 100,
      icon: Repeat
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metricCards.map((metric) => {
        const Icon = metric.icon;

        return (
          <Card className="border-white/10 bg-white/[0.04]" key={metric.label}>
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center justify-between">
                <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.05] p-3 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-sm text-white/76">
                  {metric.value}
                </span>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-white/58">{metric.label}</p>
                <Progress value={metric.progress} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
