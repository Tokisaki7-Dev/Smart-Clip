import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, Clock3 } from "lucide-react";

import { createMetadata } from "@/lib/metadata";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = createMetadata({
  title: "Pagamento em analise",
  description:
    "Acompanhe a confirmacao do checkout e veja quando sua assinatura ou seus creditos forem liberados.",
  path: "/billing/success"
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

  const [{ data: attempt }, { data: profile }] = await Promise.all([
    supabase
      .from("payment_attempts")
      .select("id, status, payment_method, amount_cents, credit_pack_id, created_at")
      .eq("id", attemptId)
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("users")
      .select("current_plan")
      .eq("id", user.id)
      .maybeSingle()
  ]);

  return {
    attempt,
    currentPlan: profile?.current_plan || "free"
  };
}

export default async function BillingSuccessPage({
  searchParams
}: {
  searchParams: Promise<{
    attempt?: string;
    plan?: string;
  }>;
}) {
  const { attempt: attemptId } = await searchParams;
  const snapshot = await getAttemptSnapshot(attemptId);
  const attempt = snapshot?.attempt || null;
  const status = attempt?.status || "pending";

  if (["failed", "canceled", "refunded"].includes(status)) {
    redirect(`/billing/failure${attemptId ? `?attempt=${encodeURIComponent(attemptId)}` : ""}`);
  }

  const isPaid = status === "paid";
  const isWaiting = status === "pending" || status === "authorized";

  return (
    <PageShell className="space-y-8">
      <div className="max-w-3xl space-y-4">
        <Badge variant={isPaid ? "success" : "primary"}>
          {isPaid ? "Pagamento confirmado" : "Confirmacao em andamento"}
        </Badge>
        <h1 className="font-display text-5xl text-white">
          {isPaid
            ? "Compra concluida e plano atualizado."
            : "Recebemos sua compra. Agora estamos confirmando o pagamento."}
        </h1>
        <p className="text-base leading-8 text-white/68">
          {isPaid
            ? "Assim que o webhook do PagBank confirmou o pagamento, o SmartClip atualizou sua conta e liberou o novo nivel de acesso."
            : "Alguns meios de pagamento podem levar alguns minutos. Se voce acabou de pagar, atualize esta pagina ou abra o billing novamente para ver o status mais recente."}
        </p>
      </div>

      <Card className="max-w-3xl border-white/10 bg-white/[0.04]">
        <CardContent className="space-y-5 p-6">
          <div className="flex items-center gap-3">
            {isPaid ? (
              <CheckCircle2 className="h-5 w-5 text-success" />
            ) : (
              <Clock3 className="h-5 w-5 text-primary" />
            )}
            <p className="text-lg font-medium text-white">
              {isPaid ? "Status finalizado" : "Aguardando confirmacao"}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/8 bg-black/20 p-4 text-sm text-white/78">
              Status atual: <span className="font-medium uppercase text-white">{status}</span>
            </div>
            <div className="rounded-2xl border border-white/8 bg-black/20 p-4 text-sm text-white/78">
              Plano atual:{" "}
              <span className="font-medium uppercase text-white">
                {snapshot?.currentPlan || "free"}
              </span>
            </div>
            <div className="rounded-2xl border border-white/8 bg-black/20 p-4 text-sm text-white/78">
              Metodo: <span className="font-medium text-white">{attempt?.payment_method || "checkout"}</span>
            </div>
            <div className="rounded-2xl border border-white/8 bg-black/20 p-4 text-sm text-white/78">
              Valor:{" "}
              <span className="font-medium text-white">
                {attempt?.amount_cents
                  ? `R$ ${(attempt.amount_cents / 100).toFixed(2).replace(".", ",")}`
                  : "processando"}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/billing">{isWaiting ? "Atualizar billing" : "Abrir billing"}</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/dashboard">Ir para o dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}
