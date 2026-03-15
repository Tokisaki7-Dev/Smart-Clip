"use client";

import { type ChangeEvent, useMemo, useState } from "react";
import { Upload, WandSparkles } from "lucide-react";

import { useUploadEstimate } from "@/hooks/use-upload-estimate";
import { type ToolDefinition } from "@/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const presetOptions = [
  "Original",
  "Reels 1080x1920",
  "Shorts 1080x1920",
  "TikTok 1080x1920",
  "Stories 1080x1920",
  "WhatsApp leve"
];

interface UploadPanelProps {
  tool: ToolDefinition;
}

export function UploadPanel({ tool }: UploadPanelProps) {
  const [fileName, setFileName] = useState("Nenhum arquivo selecionado");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(14);
  const [preset, setPreset] = useState(presetOptions[1]);
  const [fileSizeMb, setFileSizeMb] = useState(0);
  const queue = useMemo(() => {
    if (preset.includes("WhatsApp")) {
      return "padrao" as const;
    }

    return preset === "Original" ? ("padrao" as const) : ("rapida" as const);
  }, [preset]);
  const estimate = useUploadEstimate(fileSizeMb, queue);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setFileName(file.name);
    setPreviewUrl(URL.createObjectURL(file));
    setFileSizeMb(Number((file.size / (1024 * 1024)).toFixed(1)));
    setProgress(68);
  };

  return (
    <Card className="border-primary/20 bg-[#081227]/90 shadow-glow">
      <CardContent className="space-y-6 p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-primary">
              Simulacao do fluxo
            </p>
            <h2 className="mt-2 font-display text-2xl text-white">{tool.title}</h2>
          </div>
          <div className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-white/75">
            {tool.retentionPrompt}
          </div>
        </div>

        <label className="block rounded-[1.75rem] border border-dashed border-primary/35 bg-gradient-to-br from-primary/10 to-transparent p-6 text-center transition hover:border-primary/60">
          <input
            accept="video/*"
            className="hidden"
            onChange={handleFileChange}
            type="file"
          />
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/12 text-primary">
            <Upload className="h-6 w-6" />
          </div>
          <p className="mt-4 font-medium text-white">
            Arraste o video aqui ou toque para escolher
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Upload preparado para ler limites do plano, Storage e fila de jobs no Supabase.
          </p>
        </label>

        <div className="grid gap-4 lg:grid-cols-[1fr,0.9fr]">
          <div className="space-y-4 rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Arquivo atual</p>
              <span className="text-sm text-white/70">{fileSizeMb || 0} MB</span>
            </div>
            <p className="font-medium text-white">{fileName}</p>
            <Progress value={progress} />
            <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
              {previewUrl ? (
                <video className="aspect-video w-full rounded-2xl object-cover" controls src={previewUrl} />
              ) : (
                <div className="flex aspect-video items-center justify-center rounded-2xl border border-dashed border-white/10 text-sm text-muted-foreground">
                  Preview do video aparece aqui
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-5">
            <div>
              <p className="text-sm text-muted-foreground">Preset de saida</p>
              <select
                className="mt-2 h-11 w-full rounded-2xl border border-white/10 bg-[#07101F] px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/60"
                onChange={(event) => setPreset(event.target.value)}
                value={preset}
              >
                {presetOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
              <div className="flex items-center gap-3 text-primary">
                <WandSparkles className="h-5 w-5" />
                <span className="text-sm uppercase tracking-[0.2em]">Retencao</span>
              </div>
              <p className="mt-3 text-sm leading-7 text-white/80">
                Ultimo preset salvo: Reels 1080x1920. O dashboard pode sugerir
                repetir a mesma exportacao ou salvar isso como projeto.
              </p>
            </div>

            <div className="space-y-2 rounded-2xl border border-white/8 bg-black/20 p-4">
              <p className="text-sm text-muted-foreground">
                Fila estimada: {estimate.estimatedMinutes} min
              </p>
              <p className="text-sm leading-7 text-white/78">
                {estimate.uploadQuality}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Button>Gerar preview</Button>
              <Button variant="secondary">Salvar preset</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
