"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getToolEngineProfile } from '@/lib/tool-engine';
import { UploadCloud, Download, Loader2, CheckCircle2, ThumbsUp, ThumbsDown, Wand2, FileText, ChevronLeft } from 'lucide-react';

export default function ToolPage() {
  const { slug } = useParams();
  const profile = getToolEngineProfile(slug as string);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [options, setOptions] = useState<any>({ 
    start: "00:00:00", 
    end: "00:00:10", 
    preset: "WhatsApp Friendly", 
    format: "mp4", 
    hardcode: true,
    aiUpscale: false,
    browserFilter: "none"
  });
  const [compareOffset, setCompareOffset] = useState(50);
  const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "completed" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [jobId, setJobId] = useState<string | null>(null);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [showCompare, setShowCompare] = useState(false);

  // Monitoramento via SSE
  useEffect(() => {
    if (!jobId || status !== "processing") return;

    const eventSource = new EventSource(`/api/status/${jobId}`);
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setProgress(data.progress);
      
      if (data.status === "completed") {
        setStatus("completed");
        eventSource.close();
      }
      if (data.status === "error") {
        setStatus("error");
        eventSource.close();
      }
    };

    return () => eventSource.close();
  }, [jobId, status]);

  // Pedir permissão para notificações ao carregar
  useEffect(() => {
    if (typeof window !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const handleProcess = async () => {
    if (!file) return;
    setStatus("uploading");
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("tool", slug as string);
    formData.append("options", JSON.stringify(options));

    try {
      const res = await fetch("/api/process", { method: "POST", body: formData });
      const data = await res.json();
      setJobId(data.jobId);
      setStatus("processing");
    } catch (e) {
      setStatus("error");
    }
  };

  // Estimativa simples baseada no tamanho do arquivo (em MB) e complexidade da tool
  const getEstimatedTime = () => {
    if (!file) return 0;
    const sizeMb = file.size / (1024 * 1024);
    const multiplier = options.aiUpscale ? 15 : (slug === 'video-compressor' ? 2 : 0.5);
    return Math.round(sizeMb * multiplier);
  };

  const handleFeedback = async (rating: 'up' | 'down') => {
    if (!jobId || feedbackSent) return;
    await fetch("/api/feedback", {
      method: "POST",
      body: JSON.stringify({ jobId, rating, tool: slug })
    });
    setFeedbackSent(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <a href="/dashboard" className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition w-fit">
        <ChevronLeft size={16} /> Voltar ao Início
      </a>

      <header>
        <h1 className="text-3xl font-bold">{profile.primaryGoal}</h1>
        <p className="text-gray-400 mt-2">{profile.highlights.join(" • ")}</p>
      </header>

      <div className="bg-[#0A0A0B] border border-white/10 rounded-2xl p-8">
        {/* Upload Area */}
        <div className="space-y-6">
          {!previewUrl ? (
            <div 
              className="border-2 border-dashed border-white/10 rounded-xl p-10 flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 transition cursor-pointer"
              onClick={() => document.getElementById('fileInput')?.click()}
            >
              <input 
                type="file" 
                id="fileInput" 
                className="hidden" 
                onChange={handleFileChange} 
              />
              <UploadCloud className="text-blue-500 mb-4" size={48} />
              <p className="font-medium">Clique ou arraste seu vídeo</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden bg-black border border-white/10 aspect-video shadow-2xl group/player">
                {/* Original (Base) */}
                <video src={previewUrl} className="w-full h-full absolute inset-0 object-contain" muted />
                
                {/* Filtrado (Overlay com Clip Path) */}
                <div 
                  className="absolute inset-0 z-10 overflow-hidden pointer-events-none"
                  style={{ clipPath: showCompare ? `inset(0 ${100 - compareOffset}% 0 0)` : 'none' }}
                >
                  <video 
                    ref={videoRef}
                    src={previewUrl} 
                    className="w-full h-full object-contain"
                    style={{ filter: getBrowserFilterStyle(options.browserFilter) }}
                    muted
                  />
                </div>

                {/* Slider de Comparação */}
                {showCompare && (
                  <input 
                    type="range" 
                    min="0" max="100" 
                    value={compareOffset}
                    onChange={(e) => setCompareOffset(parseInt(e.target.value))}
                    className="absolute inset-x-0 bottom-1/2 translate-y-1/2 z-30 opacity-0 cursor-ew-resize h-full w-full"
                  />
                )}

                <div className="absolute top-4 left-4 pointer-events-none">
                  <span className="bg-blue-500/80 backdrop-blur-md text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest text-white shadow-lg">
                    Preview WebGL Ready
                  </span>
                </div>
                <button onClick={() => { setPreviewUrl(null); setFile(null); }} className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded transition">Trocar Vídeo</button>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                <div className="flex items-center gap-3">
                  <Wand2 size={16} className="text-blue-400" />
                  <label className="text-xs font-bold uppercase text-gray-400">Filtro:</label>
                  <select 
                    className="bg-transparent text-xs font-medium focus:outline-none cursor-pointer"
                    value={options.browserFilter}
                    onChange={e => setOptions({...options, browserFilter: e.target.value})}
                  >
                    <option value="none">Original</option>
                    <option value="cinematic">Cinematográfico</option>
                    <option value="vibrant">Vibrante</option>
                    <option value="noir">Dramático</option>
                  </select>
                </div>
                <button 
                  onClick={() => setShowCompare(!showCompare)}
                  className={`text-[10px] font-bold px-3 py-1 rounded border transition ${showCompare ? 'bg-blue-500 border-blue-400' : 'border-white/10'}`}
                >
                  MODO COMPARAÇÃO
                </button>
              </div>
            </div>
          )}
          {slug === 'video-enhancer' && (
            <div className="col-span-2 flex items-center gap-3 bg-white/5 p-4 rounded-lg border border-white/10">
              <input type="checkbox" id="aiUpscale" className="w-5 h-5 rounded border-cyan-500" 
                checked={options.aiUpscale} onChange={e => setOptions({...options, aiUpscale: e.target.checked})} />
              <div>
                <label htmlFor="aiUpscale" className="font-bold text-sm">Upscaling via IA (Real-ESRGAN)</label>
                <p className="text-xs text-gray-400">Aumenta nitidez e resolução (Processamento lento).</p>
              </div>
            </div>
          )}
        </div>

        {/* Tool Specific Options */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          {slug === 'clip-trimmer' && (
            <>
              <div className="col-span-2 flex gap-2">
                <button onClick={() => setOptions({...options, end: "00:00:15"})} className="text-[10px] bg-white/5 hover:bg-white/10 px-3 py-1 rounded">15s</button>
                <button onClick={() => setOptions({...options, end: "00:00:30"})} className="text-[10px] bg-white/5 hover:bg-white/10 px-3 py-1 rounded">30s</button>
                <button onClick={() => setOptions({...options, end: "00:01:00"})} className="text-[10px] bg-white/5 hover:bg-white/10 px-3 py-1 rounded">60s</button>
                <span className="text-[10px] text-gray-500 self-center ml-auto">Presets rápidos</span>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase font-bold">Início (HH:MM:SS)</label>
                <input className="w-full bg-black border border-white/10 rounded p-2 mt-1" value={options.start} onChange={e => setOptions({...options, start: e.target.value})} />
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase font-bold">Fim (HH:MM:SS)</label>
                <input className="w-full bg-black border border-white/10 rounded p-2 mt-1" value={options.end} onChange={e => setOptions({...options, end: e.target.value})} />
              </div>
            </>
          )}
          {slug === 'video-compressor' && (
            <div className="col-span-2">
              <label className="text-xs text-gray-500 uppercase font-bold">Qualidade</label>
              <select className="w-full bg-black border border-white/10 rounded p-2 mt-1" onChange={e => setOptions({...options, preset: e.target.value})}>
                <option>WhatsApp Friendly</option>
                <option>High Quality</option>
              </select>
            </div>
          )}
          {slug === 'format-converter' && (
            <div className="col-span-2">
              <label className="text-xs text-gray-500 uppercase font-bold">Formato de Saída</label>
              <select className="w-full bg-black border border-white/10 rounded p-2 mt-1" onChange={e => setOptions({...options, format: e.target.value})}>
                <option value="mp4">MP4 (Universal)</option>
                <option value="mov">MOV (Apple)</option>
                <option value="webm">WebM (Web)</option>
                <option value="avi">AVI (Legacy)</option>
                <option value="mkv">MKV (High Quality)</option>
              </select>
            </div>
          )}
          {slug === 'audio-extractor' && (
            <div className="col-span-2">
              <label className="text-xs text-gray-500 uppercase font-bold">Qualidade do Áudio</label>
              <select className="w-full bg-black border border-white/10 rounded p-2 mt-1" onChange={e => setOptions({...options, format: e.target.value})}>
                <option value="mp3">MP3 (320kbps)</option>
                <option value="wav">WAV (Lossless)</option>
              </select>
            </div>
          )}
          {slug === 'auto-captions' && (
            <div className="col-span-2 flex items-center gap-3 bg-white/5 p-4 rounded-lg border border-white/10">
              <input 
                type="checkbox" 
                id="hardcode"
                className="w-5 h-5 rounded border-blue-500 text-blue-500 focus:ring-blue-500" 
                checked={options.hardcode}
                onChange={e => setOptions({...options, hardcode: e.target.checked})}
              />
              <div className="flex flex-col">
                <label htmlFor="hardcode" className="font-bold text-sm">Queimar legendas no vídeo</label>
                <p className="text-xs text-gray-400">As legendas serão fixas no vídeo (Hardcode).</p>
              </div>
            </div>
          )}
        </div>

        {/* Action Button & Progress */}
        <div className="mt-8">
          {status === "idle" && (
            <button 
              disabled={!file}
              onClick={handleProcess}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl transition"
            >
              Iniciar Processamento {file && <span className="text-xs font-normal opacity-70 ml-2">(Estimado: ~{getEstimatedTime()}s)</span>}
            </button>
          )}

          {(status === "processing" || status === "uploading") && (
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2"><Loader2 className="animate-spin" size={16}/> {status === "uploading" ? "Subindo arquivo..." : "FFmpeg trabalhando..."}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          {status === "completed" && (
            <div className="flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-2 text-green-500 font-bold"><CheckCircle2 /> Concluído com sucesso!</div>
              
              <div className="flex gap-4">
                <a 
                  href={`/api/download/${jobId}`} 
                  className="flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-500 text-white rounded-full font-medium transition shadow-lg shadow-green-900/20"
                >
                  <Download size={20} /> Baixar Vídeo
                </a>
                
                {slug === 'auto-captions' && (
                  <a 
                    href={`/api/download/${jobId}?format=srt`} 
                    className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-full font-medium transition border border-white/10"
                  >
                    <FileText size={18} /> Baixar .SRT
                  </a>
                )}
              </div>

              {!feedbackSent ? (
                <div className="flex items-center gap-4 border-t border-white/5 pt-4">
                  <span className="text-xs text-gray-500">O resultado ficou como esperado?</span>
                  <button onClick={() => handleFeedback('up')} className="p-2 hover:bg-white/5 rounded-full transition text-gray-400 hover:text-green-500">
                    <ThumbsUp size={18} />
                  </button>
                  <button onClick={() => handleFeedback('down')} className="p-2 hover:bg-white/5 rounded-full transition text-gray-400 hover:text-red-500">
                    <ThumbsDown size={18} />
                  </button>
                </div>
              ) : (
                <p className="text-xs text-blue-400 italic">Obrigado pelo seu feedback!</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-sm text-yellow-200">
        <strong>Nota:</strong> Como este é um sistema SaaS sem contas, seus arquivos serão deletados automaticamente após o download ou em 24 horas.
      </div>
    </div>
  );
}

// Helper para simular LUTs/Filtros via CSS (que utiliza aceleração de hardware WebGL por baixo no Chrome/Safari)
function getBrowserFilterStyle(filter: string) {
  switch(filter) {
    case 'cinematic': return 'contrast(1.1) saturate(1.2) sepia(0.1) hue-rotate(-5deg)';
    case 'vibrant': return 'saturate(1.8) contrast(1.1)';
    case 'noir': return 'grayscale(1) contrast(1.4)';
    default: return 'none';
  }
}