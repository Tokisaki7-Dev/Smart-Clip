"use client";

import { useState } from "react";
import { UploadArea } from "@/components/dashboard/upload-area";
import { ProcessingPanel } from "@/components/dashboard/processing-panel";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Captions } from "lucide-react";

export function CaptionsTool() {
  const [file, setFile] = useState<File | null>(null);
  const [hardcode, setHardcode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
  };

  const handleGenerateCaptions = async () => {
    if (!file) return;

    setIsProcessing(true);
    const jobId = `captions-${Date.now()}`;

    setJobs([{
      id: jobId,
      name: `Gerando legendas: ${file.name}`,
      status: "processing",
      progress: 0
    }]);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("hardcode", hardcode.toString());

    try {
      const response = await fetch("/api/video/captions", {
        method: "POST",
        body: formData
      });

      if (!response.ok) throw new Error("Erro ao processar vídeo");

      const blob = await response.blob();
      const filename = hardcode ? `captioned-${file.name}` : `${file.name.split('.')[0]}.srt`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();

      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: "completed", progress: 100 } : j));
    } catch (error) {
      console.error("Erro:", error);
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: "error", error: "Erro ao processar" } : j));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Captions className="w-8 h-8 text-purple-400" />
          <h1 className="text-3xl font-bold text-white">Legendas Automáticas</h1>
        </div>
        <p className="text-slate-400">Gere legendas com IA usando OpenAI Whisper</p>
      </div>

      <div className="space-y-8">
        {!file ? (
          <UploadArea onFileSelect={handleFileSelect} />
        ) : (
          <>
            <div className="p-6 rounded-lg bg-slate-900/50 border border-slate-800">
              <h3 className="font-semibold text-white mb-4">Arquivo selecionado: {file.name}</h3>
              <button
                onClick={() => setFile(null)}
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                Escolher outro arquivo
              </button>
            </div>

            <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="hardcode"
                  checked={hardcode}
                  onCheckedChange={(checked) => setHardcode(!!checked)}
                  className="border-slate-600"
                />
                <label
                  htmlFor="hardcode"
                  className="text-sm font-medium text-white cursor-pointer"
                >
                  Queimar legendas no vídeo (hardcode)
                </label>
              </div>
              <p className="text-xs text-slate-400 mt-2 ml-7">
                Se desativado, você receberá um arquivo .srt com as legendas
              </p>
            </div>

            <Button
              onClick={handleGenerateCaptions}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              size="lg"
            >
              {isProcessing ? "Processando..." : "Gerar Legendas"}
            </Button>
          </>
        )}

        {jobs.length > 0 && <ProcessingPanel jobs={jobs} />}
      </div>
    </div>
  );
}
