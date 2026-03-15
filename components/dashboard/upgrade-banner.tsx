import Link from "next/link";
import { ArrowRight, Crown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { dashboardSnapshot } from "@/services/dashboard";

export function UpgradeBanner() {
  return (
    <Card className="border-primary/25 bg-gradient-to-r from-primary/10 via-[#8A5CFF]/10 to-transparent shadow-glow">
      <CardContent className="flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-primary">
            <Crown className="h-4 w-4" />
            CTA contextual
          </div>
          <h3 className="font-display text-2xl text-white">
            Voce ainda tem {dashboardSnapshot.fullHdRemaining} exportacoes em 1080p e{" "}
            {dashboardSnapshot.watermarkFreeRemaining} sem marca d&apos;agua no Free.
          </h3>
          <p className="max-w-2xl text-sm leading-7 text-white/72">
            Continue sem limites com o Starter ou vá para o Creator se voce ja
            esta usando presets e automacoes com frequencia.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="secondary">
            <Link href="/pricing">Comparar planos</Link>
          </Button>
          <Button asChild>
            <Link href="/billing">
              Fazer upgrade
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
