import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Manrope, Sora } from "next/font/google";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { siteConfig } from "@/lib/site-config";

import "./globals.css";

const fontSans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans"
});

const fontDisplay = Sora({
  subsets: ["latin"],
  variable: "--font-display"
});

const adsenseClient =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-2117459249791132";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | SaaS premium para cortes, legenda e conversao de video`,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  other: {
    "google-adsense-account": adsenseClient
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isVercelRuntime = Boolean(process.env.VERCEL);

  return (
    <html className="dark" lang="pt-BR">
      <body className={`${fontSans.variable} ${fontDisplay.variable}`}>
        <Script
          async
          crossOrigin="anonymous"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
          strategy="beforeInteractive"
        />
        <div className="relative min-h-screen">
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </div>
        {isVercelRuntime ? <Analytics /> : null}
        {isVercelRuntime ? <SpeedInsights /> : null}
      </body>
    </html>
  );
}
