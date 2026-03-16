"use client";

import { useState, useTransition } from "react";
import { LoaderCircle } from "lucide-react";

import type { AutomationPack } from "@/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BillingActionsProps {
  currentPlan: string;
  initialEmail?: string;
  isAuthenticated: boolean;
  packs: AutomationPack[];
}

type PaymentMethod = "credit_card" | "pix" | "boleto" | "debit_online";

const paymentMethodOptions: Array<{ value: PaymentMethod; label: string }> = [
  { value: "credit_card", label: "Cartao de credito" },
  { value: "pix", label: "Pix" },
  { value: "boleto", label: "Boleto" },
  { value: "debit_online", label: "Debito online" }
];

export function BillingActions({
  currentPlan,
  initialEmail = "",
  isAuthenticated,
  packs
}: BillingActionsProps) {
  const [checkoutEmail, setCheckoutEmail] = useState(initialEmail);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("credit_card");
  const [statusMessage, setStatusMessage] = useState(
    "Escolha a forma de pagamento para abrir o checkout da InfinitePay ou comprar creditos."
  );
  const [isSubmittingCheckout, startCheckoutTransition] = useTransition();
  const [isCancelling, startCancelTransition] = useTransition();

  const readJsonResponse = async <T,>(response: Response): Promise<T | null> => {
    const rawText = await response.text();

    if (!rawText.trim()) {
      return null;
    }

    try {
      return JSON.parse(rawText) as T;
    } catch {
      throw new Error("O servidor retornou uma resposta invalida. Tente novamente.");
    }
  };

  const handleCheckout = (planId: string, creditPackId?: string) => {
    startCheckoutTransition(async () => {
      if (!isAuthenticated) {
        setStatusMessage("Entre ou crie sua conta antes de abrir o checkout.");
        window.location.href = "/signup?next=/billing";
        return;
      }

      setStatusMessage("Criando sessao de checkout...");

      try {
        const response = await fetch("/api/billing/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            planId,
            creditPackId,
            customerEmail: checkoutEmail || undefined,
            paymentMethod,
            trialDays: planId === "starter" ? 30 : 0
          })
        });
        const data = (await readJsonResponse<{
          ok?: boolean;
          error?: string;
          session?: {
            redirectUrl?: string | null;
            message?: string;
          };
        }>(response)) || {
          ok: false,
          error: "Resposta vazia do servidor ao iniciar checkout."
        };

        if (!response.ok || !data.ok) {
          throw new Error(data.error || "Nao foi possivel iniciar o checkout.");
        }

        if (data.session?.redirectUrl) {
          setStatusMessage("Checkout criado. Redirecionando para a InfinitePay...");
          window.location.href = data.session.redirectUrl;
          return;
        }

        setStatusMessage(
          data.session?.message ||
            "Checkout criado, mas sem link da InfinitePay. Revise a configuracao do provedor."
        );
      } catch (error) {
        setStatusMessage(
          error instanceof Error ? error.message : "Falha ao iniciar checkout."
        );
      }
    });
  };

  const handleCancelSubscription = () => {
    startCancelTransition(async () => {
      setStatusMessage("Solicitando cancelamento ao final do periodo...");

      try {
        const response = await fetch("/api/billing/subscription", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            action: "cancel"
          })
        });
        const data = (await readJsonResponse<{
          ok?: boolean;
          error?: string;
        }>(response)) || {
          ok: false,
          error: "Resposta vazia do servidor ao cancelar assinatura."
        };

        if (!response.ok || !data.ok) {
          throw new Error(data.error || "Nao foi possivel cancelar a assinatura.");
        }

        setStatusMessage(
          "Cancelamento registrado. A assinatura foi marcada para encerrar ao fim do periodo atual."
        );
      } catch (error) {
        setStatusMessage(
          error instanceof Error ? error.message : "Falha ao cancelar assinatura."
        );
      }
    });
  };

  return (
    <div className="space-y-5 rounded-[1.5rem] border border-white/8 bg-black/20 p-5">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Email para o checkout</p>
        <Input
          autoComplete="email"
          onChange={(event) => setCheckoutEmail(event.target.value)}
          placeholder="Seu email para pagamento"
          type="email"
          value={checkoutEmail}
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Metodo de pagamento</p>
        <select
          className="h-11 w-full rounded-2xl border border-white/10 bg-[#07101F] px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/60"
          onChange={(event) => setPaymentMethod(event.target.value as PaymentMethod)}
          value={paymentMethod}
        >
          {paymentMethodOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button
          disabled={isSubmittingCheckout}
          onClick={() => handleCheckout(currentPlan === "FREE" ? "starter" : currentPlan.toLowerCase())}
        >
          {isSubmittingCheckout ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Iniciando
            </>
          ) : (
            isAuthenticated ? "Iniciar checkout" : "Entrar para comprar"
          )}
        </Button>
        <Button
          disabled={isCancelling || currentPlan === "FREE"}
          onClick={handleCancelSubscription}
          variant="secondary"
        >
          {isCancelling ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Cancelando
            </>
          ) : (
            "Cancelar assinatura"
          )}
        </Button>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">Creditos avulsos</p>
        <div className="grid gap-3">
          {packs.map((pack) => (
            <div
              className="flex flex-col gap-3 rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between"
              key={pack.id}
            >
              <div>
                <p className="font-medium text-white">{pack.name}</p>
                <p className="text-sm text-muted-foreground">{pack.price}</p>
              </div>
              <Button
                disabled={isSubmittingCheckout}
                onClick={() => handleCheckout("credits", pack.id)}
                variant="secondary"
              >
                {isAuthenticated ? "Comprar creditos" : "Entrar para comprar"}
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-primary/20 bg-primary/8 p-4 text-sm leading-7 text-white/80">
        {statusMessage}
      </div>
    </div>
  );
}
