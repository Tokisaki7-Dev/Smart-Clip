"use client";

import { Scissors, Captions, Zap, FileVideo, Music, Sparkles, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tools = [
  { id: "trimmer", name: "Corte de Clipes", icon: Scissors, href: "/dashboard/trimmer" },
  { id: "captions", name: "Legendas", icon: Captions, href: "/dashboard/captions" },
  { id: "compressor", name: "Compressor", icon: Zap, href: "/dashboard/compressor" },
  { id: "converter", name: "Conversor", icon: FileVideo, href: "/dashboard/converter" },
  { id: "audio", name: "Áudio", icon: Music, href: "/dashboard/audio" },
  { id: "enhancer", name: "Melhorador", icon: Sparkles, href: "/dashboard/enhancer" }
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">SC</span>
          </div>
          <span className="font-bold text-white">SmartClip</span>
        </Link>
      </div>

      {/* Tools */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = pathname === tool.href;

          return (
            <Link key={tool.id} href={tool.href}>
              <div
                className={cn(
                  "px-4 py-3 rounded-lg flex items-center gap-3 transition-colors",
                  isActive
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    : "text-slate-300 hover:bg-slate-800"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{tool.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom menu */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <button className="w-full px-4 py-3 rounded-lg flex items-center gap-3 text-slate-300 hover:bg-slate-800 transition-colors">
          <Settings className="w-5 h-5" />
          <span className="text-sm font-medium">Configurações</span>
        </button>
        <button className="w-full px-4 py-3 rounded-lg flex items-center gap-3 text-slate-300 hover:bg-red-900/20 hover:text-red-400 transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Sair</span>
        </button>
      </div>
    </aside>
  );
}
