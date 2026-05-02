"use client";

import { Scissors, Captions, Zap, FileVideo, Music, Sparkles } from "lucide-react";
import Link from "next/link";

const tools = [
  {
    id: "trimmer",
    name: "Corte de Clipes",
    description: "Recorte seus vídeos com precisão sem re-encoding com stream copy.",
    icon: Scissors,
    color: "from-blue-500 to-cyan-500",
    href: "/dashboard/trimmer"
  },
  {
    id: "captions",
    name: "Legendas Automáticas",
    description: "Gere legendas com IA usando OpenAI Whisper e queime no vídeo.",
    icon: Captions,
    color: "from-purple-500 to-pink-500",
    href: "/dashboard/captions"
  },
  {
    id: "compressor",
    name: "Compressor",
    description: "Comprima vídeos mantendo qualidade com presets otimizados.",
    icon: Zap,
    color: "from-yellow-500 to-orange-500",
    href: "/dashboard/compressor"
  },
  {
    id: "converter",
    name: "Conversor de Formatos",
    description: "Converta entre MP4, MOV, WebM, AVI e MKV sem perda.",
    icon: FileVideo,
    color: "from-green-500 to-emerald-500",
    href: "/dashboard/converter"
  },
  {
    id: "audio",
    name: "Extrator de Áudio",
    description: "Extraia áudio em MP3 320kbps ou WAV lossless.",
    icon: Music,
    color: "from-red-500 to-pink-500",
    href: "/dashboard/audio"
  },
  {
    id: "enhancer",
    name: "Melhorador de Qualidade",
    description: "Melhore qualidade com filtros avançados e upscaling por IA.",
    icon: Sparkles,
    color: "from-indigo-500 to-purple-500",
    href: "/dashboard/enhancer"
  }
];

export function ToolsShowcase() {
  return (
    <section className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Ferramentas Poderosas
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Tudo que você precisa para editar, processar e otimizar seus vídeos em um só lugar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link key={tool.id} href={tool.href}>
                <div className="group relative p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-purple-500/50 transition-all duration-300 cursor-pointer overflow-hidden h-full">
                  {/* Background gradient effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

                  <div className="relative z-10">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${tool.color} p-2.5 mb-4`}>
                      <Icon className="w-full h-full text-white" />
                    </div>

                    <h3 className="text-lg font-semibold text-white mb-2">
                      {tool.name}
                    </h3>

                    <p className="text-slate-400 text-sm">
                      {tool.description}
                    </p>

                    <div className="mt-4 flex items-center text-purple-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                      Usar ferramenta
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
