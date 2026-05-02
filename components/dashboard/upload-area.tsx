"use client";

import { useState, useRef } from "react";
import { Upload, FileVideo } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadAreaProps {
  onFileSelect: (file: File) => void;
  accepting?: string;
  maxSize?: number; // in MB
}

export function UploadArea({ onFileSelect, accepting = "video/*", maxSize = 500 }: UploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.size / (1024 * 1024) <= maxSize) {
        onFileSelect(file);
      } else {
        alert(`Arquivo muito grande. Máximo: ${maxSize}MB`);
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.size / (1024 * 1024) <= maxSize) {
        onFileSelect(file);
      } else {
        alert(`Arquivo muito grande. Máximo: ${maxSize}MB`);
      }
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative p-12 rounded-2xl border-2 border-dashed transition-all",
        isDragging
          ? "border-purple-500 bg-purple-500/10"
          : "border-slate-700 bg-slate-900/50 hover:border-slate-600"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accepting}
        onChange={handleFileInput}
        className="hidden"
      />

      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-gradient-to-br from-purple-600/20 to-pink-600/20">
            <FileVideo className="w-8 h-8 text-purple-400" />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {isDragging ? "Solte seu arquivo aqui" : "Envie seu vídeo"}
          </h3>
          <p className="text-slate-400 text-sm">
            ou clique para selecionar (máx. {maxSize}MB)
          </p>
        </div>

        <button
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-medium transition-all"
        >
          <Upload className="w-4 h-4" />
          Escolher Arquivo
        </button>
      </div>
    </div>
  );
}
