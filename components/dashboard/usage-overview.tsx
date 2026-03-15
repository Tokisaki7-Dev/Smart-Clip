import { BarChart3, Captions, Repeat, WandSparkles } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { dashboardSnapshot } from "@/services/dashboard";

const metricCards = [
  {
    label: "Exportacoes hoje",
    value: `${dashboardSnapshot.dailyExportsUsed}/${dashboardSnapshot.dailyExportsLimit}`,
    progress:
      (dashboardSnapshot.dailyExportsUsed / dashboardSnapshot.dailyExportsLimit) * 100,
    icon: BarChart3
  },
  {
    label: "Clipes automaticos no mes",
    value: `${dashboardSnapshot.monthlyAutoClipsUsed}/${dashboardSnapshot.monthlyAutoClipsLimit}`,
    progress:
      (dashboardSnapshot.monthlyAutoClipsUsed /
        dashboardSnapshot.monthlyAutoClipsLimit) *
      100,
    icon: WandSparkles
  },
  {
    label: "Legendas no mes",
    value: `${dashboardSnapshot.monthlyCaptionsUsed}/${dashboardSnapshot.monthlyCaptionsLimit}`,
    progress:
      (dashboardSnapshot.monthlyCaptionsUsed /
        dashboardSnapshot.monthlyCaptionsLimit) *
      100,
    icon: Captions
  },
  {
    label: "Ultimo preset salvo",
    value: dashboardSnapshot.lastPreset,
    progress: 100,
    icon: Repeat
  }
];

export function UsageOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metricCards.map((metric) => {
        const Icon = metric.icon;

        return (
          <Card className="border-white/8 bg-white/[0.03]" key={metric.label}>
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center justify-between">
                <div className="rounded-2xl bg-primary/12 p-3 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-sm text-white/80">{metric.value}</span>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <Progress value={metric.progress} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
