import { Cpu, Download, Sparkles } from "lucide-react";

import type { DashboardSnapshot } from "@/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface PremiumJobsProps {
  snapshot: DashboardSnapshot;
}

const statusLabelMap: Record<string, string> = {
  queued: "Na fila",
  processing: "Processando",
  completed: "Concluido",
  failed: "Falhou",
  canceled: "Cancelado"
};

export function PremiumJobs({ snapshot }: PremiumJobsProps) {
  return (
    <Card className="border-white/8 bg-white/[0.03]">
      <CardContent className="space-y-5 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-2xl text-white">Fila premium</h3>
            <p className="text-sm text-muted-foreground">
              Jobs de worker separado para clipes automaticos, cortes mais fortes e saidas mais valiosas.
            </p>
          </div>
          <Cpu className="h-5 w-5 text-primary" />
        </div>

        <div className="space-y-4">
          {snapshot.processingJobs.map((job) => (
            <div
              className="space-y-4 rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-4"
              key={job.id}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="font-medium text-white">{job.tool}</p>
                  <p className="text-sm text-muted-foreground">
                    {job.modeLabel} • {job.createdAt}
                  </p>
                </div>
                <span className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs text-primary">
                  {statusLabelMap[job.status] || job.status}
                </span>
              </div>

              {job.outputs.length > 0 ? (
                <div className="grid gap-3 md:grid-cols-2">
                  {job.outputs.map((output) => (
                    <div
                      className="flex items-center justify-between gap-3 rounded-[1rem] border border-white/8 bg-black/20 p-3"
                      key={output.id}
                    >
                      <div>
                        <p className="text-sm font-medium text-white">{output.label}</p>
                        <p className="text-xs uppercase tracking-[0.18em] text-white/45">
                          {output.resolution} • {output.status}
                        </p>
                      </div>
                      {output.status === "completed" ? (
                        <Button asChild size="sm" variant="secondary">
                          <a href={`/api/exports/${output.id}/download`}>
                            <Download className="h-4 w-4" />
                            Baixar
                          </a>
                        </Button>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-3 rounded-[1rem] border border-white/8 bg-black/20 p-3 text-sm text-white/68">
                  <Sparkles className="h-4 w-4 text-secondary" />
                  O worker ainda esta preparando as saidas desse job.
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
