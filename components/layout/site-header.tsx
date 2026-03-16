import Link from "next/link";
import { Flame, Menu, Sparkles, TrendingUp } from "lucide-react";

import { signOutAction } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { getFeaturedTools } from "@/services/tools";
import { siteConfig } from "@/lib/site-config";
import { getOptionalUser } from "@/lib/supabase/auth";

export async function SiteHeader() {
  const user = await getOptionalUser();
  const spotlightTool = getFeaturedTools()[0];

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-[rgba(5,9,16,0.78)] backdrop-blur-2xl">
      <div className="border-b border-white/6">
        <div className="container flex items-center justify-between gap-4 py-3 text-xs uppercase tracking-[0.24em] text-white/55">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
            Ferramentas desenhadas para gerar visitas e retorno recorrente
          </div>
          <Link
            className="hidden items-center gap-2 text-white/60 transition hover:text-white md:inline-flex"
            href={`/${spotlightTool.slug}`}
          >
            <Flame className="h-3.5 w-3.5 text-secondary" />
            Em destaque: {spotlightTool.title}
          </Link>
        </div>
      </div>

      <div className="container flex h-24 items-center justify-between gap-4">
        <Link className="flex items-center gap-4" href="/">
          <span className="flex h-12 w-12 items-center justify-center rounded-[1.35rem] bg-gradient-to-br from-primary via-[#5EEAFF] to-secondary text-primary-foreground shadow-glow">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <div className="font-display text-xl font-semibold tracking-tight text-white">
              SmartClip
            </div>
            <div className="text-sm text-white/55">
              cortes, clipes virais e formatos sociais em um fluxo rapido
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {siteConfig.nav.map((item) => (
            <Link
              className="text-sm font-medium text-white/62 transition hover:text-white"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            className="metric-chip"
            href={`/${spotlightTool.slug}`}
          >
            {spotlightTool.kicker}
          </Link>
          {user ? (
            <>
              <Button asChild size="sm" variant="secondary">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <form action={signOutAction}>
                <Button size="sm" type="submit" variant="ghost">
                  Sair
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button asChild size="sm" variant="ghost">
                <Link href="/login">Entrar</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">Testar gratis</Link>
              </Button>
            </>
          )}
        </div>

        <details className="lg:hidden">
          <summary className="flex h-12 w-12 cursor-pointer list-none items-center justify-center rounded-[1.35rem] border border-white/10 bg-white/[0.05] text-white">
            <Menu className="h-5 w-5" />
          </summary>
          <div className="absolute right-4 top-24 w-80 rounded-[1.8rem] border border-white/10 bg-[#0A111D]/95 p-5 shadow-soft">
            <div className="mb-4 rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-4">
              <p className="text-[11px] uppercase tracking-[0.24em] text-primary">
                Ferramenta destaque
              </p>
              <Link
                className="mt-2 block font-display text-xl text-white"
                href={`/${spotlightTool.slug}`}
              >
                {spotlightTool.title}
              </Link>
              <p className="mt-2 text-sm leading-6 text-white/65">
                {spotlightTool.shortDescription}
              </p>
            </div>

            <div className="flex flex-col gap-1">
              {siteConfig.nav.map((item) => (
                <Link
                  className="rounded-2xl px-3 py-3 text-sm text-white/72 hover:bg-white/[0.05] hover:text-white"
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {user ? (
                <>
                  <Button asChild size="sm" variant="secondary">
                    <Link href="/dashboard">Painel</Link>
                  </Button>
                  <form action={signOutAction}>
                    <Button className="w-full" size="sm" type="submit" variant="ghost">
                      Sair
                    </Button>
                  </form>
                </>
              ) : (
                <>
                  <Button asChild size="sm" variant="secondary">
                    <Link href="/login">Entrar</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href="/signup">Criar conta</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
