import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, Clock3 } from "lucide-react";

import { createMetadata } from "@/lib/metadata";
import { isSupabaseAdminConfigured, isSupabaseConfigured } from "@/lib/env";
import { syncInfinitePayState } from "@/lib/infinitepay-sync";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = createMetadata({
  title: "Pagamento em analise",
  description:
    "Acompanhe a confirmacao do checkout da InfinitePay e veja quando sua assinatura ou seus creditos forem liberados.",
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

  const [{ data: attempt }, { data: profile }, { data: subscription }] = await Promise.all([
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
      .maybeSingle(),
    supabase
      .from("subscriptions")
      .select("status, current_period_end, trial_ends_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()
  ]);

  return {
    attempt,
    currentPlan: profile?.current_plan || "free",
    subscription
  };
}

export default async function BillingSuccessPage({
  searchParams
}: {
  searchParams: Promise<{
    attempt?: string;
    plan?: string;
    order_nsu?: string;
    transaction_nsu?: string;
    slug?: string;
    receipt_url?: string;
    capture_method?: string;
  }>;
}) {
  const {
    attempt: attemptIdFromQuery,
    order_nsu: orderNsu,
    transaction_nsu: transactionNsu,
    slug
  } = await searchParams;
  const attemptId = attemptIdFromQuery || orderNsu;
  let snapshot = await getAttemptSnapshot(attemptId);

  if (
    attemptId &&
    snapshot?.attempt &&
    ["pending", "authorized"].includes(snapshot.attempt.status) &&
    isSupabaseAdminConfigured()
  ) {
    try {
      const supabase = await createSupabaseServerClient();
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (user) {
        const admin = createSupabaseAdminClient();
        await syncInfinitePayState({
          admin,
          attemptId: attemptId,
          orderNsu: orderNsu || attemptId,
          transactionNsu,
          slug
        });
        snapshot = await getAttemptSnapshot(attemptId);
      }
    } catch {
      // Se a sincronizacao falhar, a pagina continua exibindo o ultimo estado conhecido.
    }
  }

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
            ? "Assim que a InfinitePay confirmou o pagamento, o SmartClip atualizou sua conta e liberou o novo nivel de acesso."
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
            <div className="rounded-2xl border border-white/8 bg-black/20 p-4 text-sm text-white/78">
              Expira em:{" "}
              <span className="font-medium text-white">
                {snapshot?.subscription?.current_period_end
                  ? new Date(snapshot.subscription.current_period_end).toLocaleDateString("pt-BR")
                  : "aguardando ciclo"}
              </span>
            </div>
            <div className="rounded-2xl border border-white/8 bg-black/20 p-4 text-sm text-white/78">
              Assinatura:{" "}
              <span className="font-medium uppercase text-white">
                {snapshot?.subscription?.status || "sem ciclo ativo"}
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
