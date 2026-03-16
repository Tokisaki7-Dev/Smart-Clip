import { Clock3, FileVideo, RefreshCw } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { DashboardSnapshot } from "@/types";

interface RecentAssetsProps {
  snapshot: DashboardSnapshot;
}

export function RecentAssets({ snapshot }: RecentAssetsProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card className="border-white/8 bg-white/[0.03]">
        <CardContent className="space-y-5 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-2xl text-white">Arquivos recentes</h3>
              <p className="text-sm text-muted-foreground">
                {snapshot.expirationLabel}
              </p>
            </div>
            <Clock3 className="h-5 w-5 text-primary" />
          </div>

          <div className="space-y-4">
            {snapshot.recentFiles.map((file) => (
              <div
                className="flex items-start justify-between gap-4 rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-4"
                key={file.name}
              >
                <div className="space-y-1">
                  <p className="font-medium text-white">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {file.size} • expira em {file.expiresIn}
                  </p>
                </div>
                <span className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs text-primary">
                  {file.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/8 bg-white/[0.03]">
        <CardContent className="space-y-5 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-2xl text-white">Exportacoes recentes</h3>
              <p className="text-sm text-muted-foreground">
                Repetir ultima exportacao reduz atrito e acelera retorno.
              </p>
            </div>
            <FileVideo className="h-5 w-5 text-primary" />
          </div>

          <div className="space-y-4">
            {snapshot.recentExports.map((item) => (
              <div
                className="flex items-start justify-between gap-4 rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-4"
                key={item.name}
              >
                <div className="space-y-1">
                  <p className="font-medium text-white">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.format} • {item.resolution} • {item.finishedAt}
                  </p>
                </div>
                <div className="flex gap-2">
                  {item.status === "completed" ? (
                    <Button asChild size="sm" variant="secondary">
                      <a href={`/api/exports/${item.id}/download`}>
                        Baixar
                      </a>
                    </Button>
                  ) : null}
                  <Button asChild size="sm" variant="secondary">
                    <Link href={`/${item.toolSlug}#smartclip-uploader`}>
                      <RefreshCw className="h-4 w-4" />
                      Repetir
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
