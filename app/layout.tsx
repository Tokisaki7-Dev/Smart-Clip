import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Manrope, Sora } from "next/font/google";
import Script from "next/script";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { siteConfig } from "@/lib/site-config";

import "./globals.css";

const adsenseClient =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-2117459249791132";

const fontSans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans"
});

const fontDisplay = Sora({
  subsets: ["latin"],
  variable: "--font-display"
});

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
      <head>
        <Script
          crossOrigin="anonymous"
          id="google-adsense"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${fontSans.variable} ${fontDisplay.variable}`}>
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
