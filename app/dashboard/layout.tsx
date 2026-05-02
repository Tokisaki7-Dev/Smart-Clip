import React from 'react';
import Link from 'next/link';
import { 
  Scissors, 
  Type, 
  Zap, 
  RefreshCw, 
  Music, 
  Sparkles, 
  LayoutDashboard 
} from 'lucide-react';
import { DiskUsageCounter } from '@/components/disk-usage-counter';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const menuItems = [
    { name: 'Início', icon: <LayoutDashboard size={20} />, href: '/dashboard' },
    { name: 'Corte Rápido', icon: <Scissors size={20} />, href: '/dashboard/clip-trimmer' },
    { name: 'Legendas IA', icon: <Type size={20} />, href: '/dashboard/auto-captions' },
    { name: 'Compressor', icon: <Zap size={20} />, href: '/dashboard/video-compressor' },
    { name: 'Conversor', icon: <RefreshCw size={20} />, href: '/dashboard/format-converter' },
    { name: 'Extrair Áudio', icon: <Music size={20} />, href: '/dashboard/audio-extractor' },
    { name: 'Melhorar Vídeo', icon: <Sparkles size={20} />, href: '/dashboard/video-enhancer' },
  ];

  return (
    <div className="flex h-screen bg-[#050505] text-white">
      {/* Sidebar Lateral */}
      <aside className="w-64 border-r border-white/10 bg-[#0A0A0B] p-4 hidden md:flex flex-col">
        <div className="mb-8 px-2 font-bold text-2xl tracking-tighter text-blue-500">
          SmartClip
        </div>
        <nav className="space-y-1 flex-1">
          {menuItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition hover:bg-white/5 hover:text-blue-400 group"
            >
              <span className="text-gray-400 group-hover:text-blue-400">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5">
          <DiskUsageCounter />
        </div>
      </aside>

      {/* Área de Conteúdo Principal */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        {children}
      </main>
    </div>
  );
}