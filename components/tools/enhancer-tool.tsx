"use client";

import { useState } from "react";
import { UploadArea } from "@/components/dashboard/upload-area";
import { ProcessingPanel } from "@/components/dashboard/processing-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles } from "lucide-react";

export function EnhancerTool() {
  const [file, setFile] = useState<File | null>(null);
  const [sharpness, setSharpness] = useState("1.2");
  const [denoise, setDenoise] = useState("0.5");
  const [saturation, setSaturation] = useState("1.0");
  const [contrast, setContrast] = useState("1.0");
  const [isProcessing, setIsProcessing] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
  };

  const handleEnhance = async () => {
    if (!file) return;

    setIsProcessing(true);
    const jobId = `enhance-${Date.now()}`;

    setJobs([{
      id: jobId,
      name: `Melhorando qualidade: ${file.name}`,
      status: "processing",
      progress: 0
    }]);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("sharpness", sharpness);
    formData.append("denoise", denoise);
    formData.append("saturation", saturation);
    formData.append("contrast", contrast);

    try {
      const response = await fetch("/api/video/enhance", {
        method: "POST",
        body: formData
      });

      if (!response.ok) throw new Error("Erro ao processar vídeo");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `enhanced-${file.name}`;
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
          <Sparkles className="w-8 h-8 text-indigo-400" />
          <h1 className="text-3xl font-bold text-white">Melhorador de Qualidade</h1>
        </div>
        <p className="text-slate-400">Melhore a qualidade do seu vídeo com filtros avançados</p>
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

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Nitidez (Unsharp): {sharpness}
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={sharpness}
                  onChange={(e) => setSharpness(e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Redução de Ruído: {denoise}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={denoise}
                  onChange={(e) => setDenoise(e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Saturação: {saturation}
                </label>
                <input
                  type="range"
                  min="0"}
                  max="2"
                  step="0.1"
                  value={saturation}
                  onChange={(e) => setSaturation(e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Contraste: {contrast}
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={contrast}
                  onChange={(e) => setContrast(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            <Button
              onClick={handleEnhance}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
              size="lg"
            >
              {isProcessing ? "Processando..." : "Melhorar Qualidade"}
            </Button>
          </>
        )}

        {jobs.length > 0 && <ProcessingPanel jobs={jobs} />}
      </div>
    </div>
  );
}
