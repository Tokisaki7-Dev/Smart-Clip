"use client";

import { useState } from "react";
import { UploadArea } from "@/components/dashboard/upload-area";
import { ProcessingPanel } from "@/components/dashboard/processing-panel";
import { Button } from "@/components/ui/button";
import { FileVideo } from "lucide-react";

const FORMATS = ["MP4", "MOV", "WebM", "AVI", "MKV"];

export function ConverterTool() {
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState("MP4");
  const [isProcessing, setIsProcessing] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
  };

  const handleConvert = async () => {
    if (!file) return;

    setIsProcessing(true);
    const jobId = `convert-${Date.now()}`;

    setJobs([{
      id: jobId,
      name: `Convertendo para ${targetFormat}: ${file.name}`,
      status: "processing",
      progress: 0
    }]);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("format", targetFormat);

    try {
      const response = await fetch("/api/video/convert", {
        method: "POST",
        body: formData
      });

      if (!response.ok) throw new Error("Erro ao processar vídeo");

      const blob = await response.blob();
      const filename = `${file.name.split('.')[0]}.${targetFormat.toLowerCase()}`;
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
          <FileVideo className="w-8 h-8 text-green-400" />
          <h1 className="text-3xl font-bold text-white">Conversor de Formatos</h1>
        </div>
        <p className="text-slate-400">Converta seus vídeos entre diferentes formatos</p>
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
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {FORMATS.map((format) => (
                  <button
                    key={format}
                    onClick={() => setTargetFormat(format)}
                    className={`p-3 rounded-lg font-semibold transition-all ${
                      targetFormat === format
                        ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                        : "bg-slate-900/50 border border-slate-700 text-slate-300 hover:border-slate-600"
                    }`}
                  >
                    {format}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleConvert}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
              size="lg"
            >
              {isProcessing ? "Processando..." : "Converter Vídeo"}
            </Button>
          </>
        )}

        {jobs.length > 0 && <ProcessingPanel jobs={jobs} />}
      </div>
    </div>
  );
}
