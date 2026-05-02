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
    <header className="sticky top-0 z-50 border-b border-purple-500/20 bg-gradient-to-r from-black via-purple-900/10 to-black backdrop-blur-xl">
      <div className="container flex h-20 items-center justify-between gap-4">
        {/* Logo */}
        <Link className="flex items-center gap-3 group" href="/">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-magenta-600 text-white shadow-lg group-hover:shadow-purple-500/50 transition-shadow">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="hidden sm:block">
            <div className="font-display text-lg font-bold text-white">
              SmartClip
            </div>
          </div>
        </Link>

        {/* Nav Desktop */}
        <nav className="hidden items-center gap-8 lg:flex">
          {siteConfig.nav.filter(item => !item.label.includes('Preço')).map((item) => (
            <Link
              className="text-sm font-medium text-white/70 hover:text-white transition"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTAs Desktop */}
        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <>
              <Button asChild size="sm" variant="ghost">
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
              <Button asChild size="sm" variant="ghost" className="text-white/70 hover:text-white">
                <Link href="/login">Entrar</Link>
              </Button>
              <Button asChild size="sm" className="bg-gradient-to-r from-purple-600 to-magenta-600 hover:from-purple-700 hover:to-magenta-700">
                <Link href="/signup">Começar</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <details className="lg:hidden">
          <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-lg border border-purple-500/30 bg-purple-500/10 text-white hover:bg-purple-500/20 transition">
            <Menu className="h-5 w-5" />
          </summary>
          <div className="absolute right-4 top-20 w-80 rounded-xl border border-purple-500/30 bg-black/95 backdrop-blur p-4 shadow-xl">
            <div className="flex flex-col gap-2">
              {siteConfig.nav.filter(item => !item.label.includes('Preço')).map((item) => (
                <Link
                  className="rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-purple-500/20 hover:text-white transition"
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
                  <Button asChild size="sm" className="bg-gradient-to-r from-purple-600 to-magenta-600">
                    <Link href="/signup">Começar</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </details>
      </div>
    </header>
  );

