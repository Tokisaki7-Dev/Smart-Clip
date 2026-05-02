"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-32 pb-24">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-1/3 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-white tracking-tight">
                Edite Seus Vídeos em <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">Segundos</span>
              </h1>
              <p className="text-xl text-slate-300 max-w-lg">
                Ferramentas poderosas de edição de vídeo com IA para cortar, compactar, adicionar legendas e melhorar a qualidade em tempo real.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                  Começar Agora <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="border-slate-600 text-white hover:bg-slate-800">
                Ver Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-slate-700">
              <div>
                <div className="text-2xl font-bold text-purple-400">24</div>
                <div className="text-sm text-slate-400">Ferramentas</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">1M+</div>
                <div className="text-sm text-slate-400">Videos Processados</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">10k+</div>
                <div className="text-sm text-slate-400">Usuários Ativos</div>
              </div>
            </div>
          </div>

          {/* Right side - Visual preview */}
          <div className="relative lg:h-[500px] rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/40 to-pink-600/40 rounded-2xl backdrop-blur-xl border border-purple-500/50">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-400 to-pink-600 rounded-lg animate-pulse"></div>
                  <p className="text-white font-semibold">Clique para começar</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
