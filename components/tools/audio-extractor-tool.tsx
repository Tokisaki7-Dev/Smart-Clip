"use client";

import { useState } from "react";
import { UploadArea } from "@/components/dashboard/upload-area";
import { ProcessingPanel } from "@/components/dashboard/processing-panel";
import { Button } from "@/components/ui/button";
import { Music } from "lucide-react";

export function AudioExtractorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [audioFormat, setAudioFormat] = useState<"mp3" | "wav">("mp3");
  const [isProcessing, setIsProcessing] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
  };

  const handleExtractAudio = async () => {
    if (!file) return;

    setIsProcessing(true);
    const jobId = `audio-${Date.now()}`;

    setJobs([{
      id: jobId,
      name: `Extraindo áudio: ${file.name}`,
      status: "processing",
      progress: 0
    }]);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("format", audioFormat);

    try {
      const response = await fetch("/api/video/extract-audio", {
        method: "POST",
        body: formData
      });

      if (!response.ok) throw new Error("Erro ao processar vídeo");

      const blob = await response.blob();
      const filename = `audio-${file.name.split('.')[0]}.${audioFormat}`;
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
          <Music className="w-8 h-8 text-red-400" />
          <h1 className="text-3xl font-bold text-white">Extrator de Áudio</h1>
        </div>
        <p className="text-slate-400">Extraia a trilha sonora do seu vídeo em MP3 ou WAV</p>
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

            <div>
              <label className="block text-sm font-medium text-white mb-3">Formato de Saída</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setAudioFormat("mp3")}
                  className={`p-4 rounded-lg border transition-all ${
                    audioFormat === "mp3"
                      ? "border-red-500 bg-red-500/10"
                      : "border-slate-700 hover:border-slate-600"
                  }`}
                >
                  <p className="font-semibold text-white">MP3 320kbps</p>
                  <p className="text-xs text-slate-400 mt-1">Comprimido e compatível</p>
                </button>
                <button
                  onClick={() => setAudioFormat("wav")}
                  className={`p-4 rounded-lg border transition-all ${
                    audioFormat === "wav"
                      ? "border-red-500 bg-red-500/10"
                      : "border-slate-700 hover:border-slate-600"
                  }`}
                >
                  <p className="font-semibold text-white">WAV Lossless</p>
                  <p className="text-xs text-slate-400 mt-1">Qualidade original</p>
                </button>
              </div>
            </div>

            <Button
              onClick={handleExtractAudio}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white"
              size="lg"
            >
              {isProcessing ? "Processando..." : "Extrair Áudio"}
            </Button>
          </>
        )}

        {jobs.length > 0 && <ProcessingPanel jobs={jobs} />}
      </div>
    </div>
  );
}
