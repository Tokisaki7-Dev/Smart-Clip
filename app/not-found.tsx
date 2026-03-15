import Link from "next/link";

import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <PageShell>
      <Card className="mx-auto max-w-2xl border-white/8 bg-white/[0.03]">
        <CardContent className="space-y-4 p-8 text-center">
          <p className="text-sm uppercase tracking-[0.24em] text-primary">404</p>
          <h1 className="font-display text-4xl text-white">Pagina nao encontrada</h1>
          <p className="text-base leading-7 text-muted-foreground">
            A rota pedida nao existe ou ainda nao foi publicada neste cluster do SmartClip.
          </p>
          <Button asChild>
            <Link href="/">Voltar para a home</Link>
          </Button>
        </CardContent>
      </Card>
    </PageShell>
  );
}
