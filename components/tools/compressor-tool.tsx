"use client";

import { useState } from "react";
import { UploadArea } from "@/components/dashboard/upload-area";
import { ProcessingPanel } from "@/components/dashboard/processing-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap } from "lucide-react";

export function CompressorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [preset, setPreset] = useState<"whatsapp" | "high-quality">("whatsapp");
  const [crf, setCrf] = useState("28");
  const [isProcessing, setIsProcessing] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
  };

  const handleCompress = async () => {
    if (!file) return;

    setIsProcessing(true);
    const jobId = `compress-${Date.now()}`;

    setJobs([{
      id: jobId,
      name: `Comprimindo: ${file.name}`,
      status: "processing",
      progress: 0
    }]);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("preset", preset);
    formData.append("crf", crf);

    try {
      const response = await fetch("/api/video/compress", {
        method: "POST",
        body: formData
      });

      if (!response.ok) throw new Error("Erro ao processar vídeo");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `compressed-${file.name}`;
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
          <Zap className="w-8 h-8 text-yellow-400" />
          <h1 className="text-3xl font-bold text-white">Compressor de Vídeo</h1>
        </div>
        <p className="text-slate-400">Reduza o tamanho do seu vídeo mantendo a qualidade</p>
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

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-3">Preset</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPreset("whatsapp")}
                    className={`p-4 rounded-lg border transition-all ${
                      preset === "whatsapp"
                        ? "border-yellow-500 bg-yellow-500/10"
                        : "border-slate-700 hover:border-slate-600"
                    }`}
                  >
                    <p className="font-semibold text-white">WhatsApp Friendly</p>
                    <p className="text-xs text-slate-400 mt-1">Menor tamanho</p>
                  </button>
                  <button
                    onClick={() => setPreset("high-quality")}
                    className={`p-4 rounded-lg border transition-all ${
                      preset === "high-quality"
                        ? "border-yellow-500 bg-yellow-500/10"
                        : "border-slate-700 hover:border-slate-600"
                    }`}
                  >
                    <p className="font-semibold text-white">Alta Qualidade</p>
                    <p className="text-xs text-slate-400 mt-1">Mais detalhes</p>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">CRF (Constant Rate Factor): {crf}</label>
                <input
                  type="range"
                  min="18"
                  max="51"
                  value={crf}
                  onChange={(e) => setCrf(e.target.value)}
                  className="w-full"
                />
                <p className="text-xs text-slate-400 mt-2">18 = máxima qualidade, 51 = máxima compressão</p>
              </div>
            </div>

            <Button
              onClick={handleCompress}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white"
              size="lg"
            >
              {isProcessing ? "Processando..." : "Comprimir Vídeo"}
            </Button>
          </>
        )}

        {jobs.length > 0 && <ProcessingPanel jobs={jobs} />}
      </div>
    </div>
  );
}
