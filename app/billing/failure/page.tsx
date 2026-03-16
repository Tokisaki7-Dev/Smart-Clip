import Link from "next/link";
import { AlertTriangle } from "lucide-react";

import { createMetadata } from "@/lib/metadata";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = createMetadata({
  title: "Pagamento nao concluido",
  description:
    "Veja o status da tentativa de pagamento e volte ao billing para tentar novamente.",
  path: "/billing/failure"
});

async function getAttemptSnapshot(attemptId?: string) {
  if (!attemptId || !isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: attempt } = await supabase
    .from("payment_attempts")
    .select("id, status, payment_method, amount_cents, created_at")
    .eq("id", attemptId)
    .eq("user_id", user.id)
    .maybeSingle();

  return attempt;
}

export default async function BillingFailurePage({
  searchParams
}: {
  searchParams: Promise<{
    attempt?: string;
  }>;
}) {
  const { attempt: attemptId } = await searchParams;
  const attempt = await getAttemptSnapshot(attemptId);

  return (
    <PageShell className="space-y-8">
      <div className="max-w-3xl space-y-4">
        <Badge variant="secondary">Pagamento nao confirmado</Badge>
        <h1 className="font-display text-5xl text-white">
          Nao conseguimos concluir esta compra.
        </h1>
        <p className="text-base leading-8 text-white/68">
          O checkout foi interrompido ou o provedor devolveu um status sem confirmacao final.
          Voce pode voltar ao billing e tentar outra forma de pagamento.
        </p>
      </div>

      <Card className="max-w-3xl border-white/10 bg-white/[0.04]">
        <CardContent className="space-y-5 p-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-secondary" />
            <p className="text-lg font-medium text-white">Tentativa sem confirmacao</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/8 bg-black/20 p-4 text-sm text-white/78">
              Status:{" "}
              <span className="font-medium uppercase text-white">
                {attempt?.status || "indisponivel"}
              </span>
            </div>
            <div className="rounded-2xl border border-white/8 bg-black/20 p-4 text-sm text-white/78">
              Metodo: <span className="font-medium text-white">{attempt?.payment_method || "checkout"}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/billing">Tentar novamente</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/pricing">Rever planos</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}
