import type { Metadata } from "next";
import Script from "next/script";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { siteConfig } from "@/lib/site-config";

import "./globals.css";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans"
});

const fontDisplay = Space_Grotesk({
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
  return (
    <html className="dark" lang="pt-BR">
      <body className={`${fontSans.variable} ${fontDisplay.variable} overflow-x-hidden`}>
        <Script
          async
          crossOrigin="anonymous"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
          strategy="beforeInteractive"
        />
        <Script id="adsense-auto-ads" strategy="afterInteractive">
          {`window.adsbygoogle = window.adsbygoogle || []; if (!window.__smartclipAutoAdsEnabled) { window.adsbygoogle.push({ google_ad_client: "${adsenseClient}", enable_page_level_ads: true }); window.__smartclipAutoAdsEnabled = true; }`}
        </Script>
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute -left-32 top-8 h-80 w-80 rounded-full bg-primary/15 blur-[140px]" />
          <div className="absolute right-0 top-20 h-[28rem] w-[28rem] rounded-full bg-secondary/12 blur-[180px]" />
          <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-accent/10 blur-[160px]" />
        </div>
        <div className="relative min-h-screen">
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
