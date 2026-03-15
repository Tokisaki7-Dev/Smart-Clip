import Link from "next/link";

import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/8 bg-[#050816]">
      <div className="container grid gap-10 py-12 lg:grid-cols-[1.4fr,1fr,1fr]">
        <div className="space-y-4">
          <h3 className="font-display text-2xl text-white">{siteConfig.name}</h3>
          <p className="max-w-md text-sm leading-7 text-muted-foreground">
            Plataforma pensada para transformar videos em clips prontos, com
            automacao premium, billing flexivel e base de SEO para crescer com
            trafego qualificado.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-white/70">
            Navegacao
          </h4>
          <div className="flex flex-col gap-3">
            {siteConfig.nav.map((item) => (
              <Link
                className="text-sm text-muted-foreground transition-colors hover:text-white"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-white/70">
            Base legal
          </h4>
          <div className="flex flex-col gap-3">
            {siteConfig.footerLinks.map((item) => (
              <Link
                className="text-sm text-muted-foreground transition-colors hover:text-white"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
            <a
              className="text-sm text-muted-foreground transition-colors hover:text-white"
              href={`mailto:${siteConfig.supportEmail}`}
            >
              {siteConfig.supportEmail}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
