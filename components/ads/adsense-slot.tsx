"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

interface AdsenseSlotProps {
  label: string;
  slotKey: keyof typeof adsenseSlots;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const adsenseClient =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-2117459249791132";

const adsenseSlots = {
  home: process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME,
  blogTop: process.env.NEXT_PUBLIC_ADSENSE_SLOT_BLOG_TOP,
  blogMiddle: process.env.NEXT_PUBLIC_ADSENSE_SLOT_BLOG_MIDDLE,
  blogBottom: process.env.NEXT_PUBLIC_ADSENSE_SLOT_BLOG_BOTTOM,
  toolResult: process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL_RESULT
} as const;

export function AdsenseSlot({
  label,
  slotKey,
  className
}: AdsenseSlotProps) {
  const adRef = useRef<HTMLModElement | null>(null);
  const slotId = adsenseSlots[slotKey];

  useEffect(() => {
    if (!slotId || !adRef.current) {
      return;
    }

    if (adRef.current.dataset.loaded === "true") {
      return;
    }

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
      adRef.current.dataset.loaded = "true";
    } catch (error) {
      console.error("Falha ao inicializar slot do AdSense", error);
    }
  }, [slotId]);

  if (!slotId) {
    if (process.env.NODE_ENV === "production") {
      return null;
    }

    return (
      <div
        className={cn(
          "rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.04] p-4 text-center text-xs uppercase tracking-[0.24em] text-muted-foreground",
          className
        )}
      >
        Espaco reservado para AdSense: {label}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4",
        className
      )}
    >
      <p className="mb-3 text-[11px] uppercase tracking-[0.24em] text-white/45">
        Publicidade
      </p>
      <ins
        ref={adRef}
        className="adsbygoogle block w-full overflow-hidden rounded-2xl"
        data-ad-client={adsenseClient}
        data-ad-format="auto"
        data-ad-slot={slotId}
        data-full-width-responsive="true"
        style={{ display: "block", minHeight: 120 }}
      />
    </div>
  );
}
