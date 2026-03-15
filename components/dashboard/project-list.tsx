import { Copy, FolderOpen, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { dashboardSnapshot } from "@/services/dashboard";

export function ProjectList() {
  return (
    <Card className="border-white/8 bg-white/[0.03]">
      <CardContent className="space-y-5 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-display text-2xl text-white">Projetos e presets</h3>
            <p className="text-sm text-muted-foreground">
              Projetos simples, presets salvos e duplicacao reduzem abandono.
            </p>
          </div>
          <Button size="sm" variant="secondary">
            <Plus className="h-4 w-4" />
            Novo projeto
          </Button>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {dashboardSnapshot.recentProjects.map((project) => (
            <div
              className="rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-5"
              key={project.name}
            >
              <div className="flex items-center justify-between">
                <div className="rounded-2xl bg-primary/12 p-3 text-primary">
                  <FolderOpen className="h-5 w-5" />
                </div>
                <Button size="sm" variant="ghost">
                  <Copy className="h-4 w-4" />
                  Duplicar
                </Button>
              </div>
              <h4 className="mt-4 font-display text-xl text-white">{project.name}</h4>
              <p className="mt-2 text-sm text-muted-foreground">
                {project.tool} • atualizado {project.lastEdited}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
