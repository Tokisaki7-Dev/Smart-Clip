import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface CtaStripProps {
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}

export function CtaStrip({
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel
}: CtaStripProps) {
  return (
    <Card className="border-white/10 bg-[radial-gradient(circle_at_left,rgba(255,123,84,0.12),transparent_26%),linear-gradient(90deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))]">
      <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.24em] text-primary">Pronto para usar</p>
          <h3 className="mt-3 font-display text-3xl text-white">{title}</h3>
          <p className="mt-3 text-sm leading-7 text-white/65">{description}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link href={primaryHref}>{primaryLabel}</Link>
          </Button>
          {secondaryHref && secondaryLabel ? (
            <Button asChild variant="secondary">
              <Link href={secondaryHref}>{secondaryLabel}</Link>
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
