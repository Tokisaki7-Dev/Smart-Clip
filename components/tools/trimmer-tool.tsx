"use client";

import { useState } from "react";
import { UploadArea } from "@/components/dashboard/upload-area";
import { ProcessingPanel } from "@/components/dashboard/processing-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Scissors } from "lucide-react";

export function TrimmerTool() {
  const [file, setFile] = useState<File | null>(null);
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("00:10");
  const [isProcessing, setIsProcessing] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
  };

  const handleTrim = async () => {
    if (!file) return;

    setIsProcessing(true);
    const jobId = `trim-${Date.now()}`;
    
    setJobs([{
      id: jobId,
      name: `Cortando: ${file.name}`,
      status: "processing",
      progress: 0
    }]);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("startTime", startTime);
    formData.append("endTime", endTime);

    try {
      const response = await fetch("/api/video/trim", {
        method: "POST",
        body: formData
      });

      if (!response.ok) throw new Error("Erro ao processar vídeo");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `trimmed-${file.name}`;
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
          <Scissors className="w-8 h-8 text-blue-400" />
          <h1 className="text-3xl font-bold text-white">Corte de Clipes</h1>
        </div>
        <p className="text-slate-400">Recorte seus vídeos com precisão usando stream copy para máxima velocidade</p>
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Início (hh:mm:ss)</label>
                <Input
                  type="text"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  placeholder="00:00:00"
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Fim (hh:mm:ss)</label>
                <Input
                  type="text"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  placeholder="00:10:00"
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>
            </div>

            <Button
              onClick={handleTrim}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
              size="lg"
            >
              {isProcessing ? "Processando..." : "Cortar Vídeo"}
            </Button>
          </>
        )}

        {jobs.length > 0 && <ProcessingPanel jobs={jobs} />}
      </div>
    </div>
  );
}
