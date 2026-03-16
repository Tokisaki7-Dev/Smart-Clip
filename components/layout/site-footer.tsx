import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { getFeaturedTools } from "@/services/tools";
import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  const featuredTools = getFeaturedTools().slice(0, 3);

  return (
    <footer className="mt-20 border-t border-white/8 bg-[rgba(3,6,12,0.88)]">
      <div className="container py-14">
        <div className="mb-10 grid gap-6 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 lg:grid-cols-[1.3fr,0.7fr] lg:p-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Crescimento pratico
            </div>
            <h3 className="font-display text-3xl leading-tight text-white">
              O SmartClip foi desenhado para ser util logo no primeiro upload e
              forte o bastante para virar rotina.
            </h3>
            <p className="max-w-2xl text-sm leading-7 text-white/65">
              Ferramentas com alta intencao, interface simples, espacos de
              monetizacao discretos e uma escada clara entre gratis, assinatura
              e creditos avulsos.
            </p>
          </div>

          <div className="grid gap-3">
            {featuredTools.map((tool) => (
              <Link
                className="flex items-center justify-between rounded-[1.4rem] border border-white/10 bg-black/20 px-4 py-4 text-sm text-white/78 transition hover:border-primary/35 hover:bg-white/[0.05] hover:text-white"
                href={`/${tool.slug}`}
                key={tool.slug}
              >
                <span>{tool.title}</span>
                <ArrowRight className="h-4 w-4 text-primary" />
              </Link>
            ))}
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.2fr,0.8fr,0.8fr,0.8fr]">
          <div className="space-y-4">
            <h3 className="font-display text-2xl text-white">{siteConfig.name}</h3>
            <p className="max-w-md text-sm leading-7 text-white/60">
              Plataforma para cortar, verticalizar, compactar e transformar videos
              em clipes mais fortes para descoberta, venda e distribuicao.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-xs uppercase tracking-[0.24em] text-white/45">
              Navegacao
            </h4>
            <div className="flex flex-col gap-3">
              {siteConfig.nav.map((item) => (
                <Link
                  className="text-sm text-white/65 transition hover:text-white"
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-xs uppercase tracking-[0.24em] text-white/45">
              Legal e billing
            </h4>
            <div className="flex flex-col gap-3">
              {siteConfig.footerLinks.map((item) => (
                <Link
                  className="text-sm text-white/65 transition hover:text-white"
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-xs uppercase tracking-[0.24em] text-white/45">
              Contato
            </h4>
            <div className="flex flex-col gap-3">
              <a
                className="text-sm text-white/65 transition hover:text-white"
                href={`mailto:${siteConfig.supportEmail}`}
              >
                {siteConfig.supportEmail}
              </a>
              <Link className="text-sm text-white/65 transition hover:text-white" href="/contact">
                Falar com o time
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
