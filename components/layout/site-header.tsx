import Link from "next/link";
import { Menu, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-[rgba(4,6,18,0.76)] backdrop-blur-xl">
      <div className="container flex h-20 items-center justify-between gap-4">
        <Link className="flex items-center gap-3" href="/">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-[#905CFF] shadow-glow">
            <Sparkles className="h-5 w-5 text-white" />
          </span>
          <div>
            <div className="font-display text-lg font-semibold text-white">
              SmartClip
            </div>
            <div className="text-xs text-muted-foreground">
              Video SaaS para publicar mais rapido
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {siteConfig.nav.map((item) => (
            <Link
              className="text-sm text-muted-foreground transition-colors hover:text-white"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button asChild size="sm" variant="ghost">
            <Link href="/login">Entrar</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/signup">Testar gratis</Link>
          </Button>
        </div>

        <details className="lg:hidden">
          <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white">
            <Menu className="h-5 w-5" />
          </summary>
          <div className="absolute right-4 top-16 w-72 rounded-[1.5rem] border border-white/10 bg-[#0A0F27] p-4 shadow-soft">
            <div className="flex flex-col gap-1">
              {siteConfig.nav.map((item) => (
                <Link
                  className="rounded-2xl px-3 py-2 text-sm text-muted-foreground hover:bg-white/6 hover:text-white"
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button asChild size="sm" variant="secondary">
                <Link href="/login">Entrar</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">Gratis</Link>
              </Button>
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
