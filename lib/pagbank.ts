import crypto from "node:crypto";

import { z } from "zod";

const paymentPayloadSchema = z.object({
  planId: z.string(),
  customerEmail: z.string().email().optional(),
  paymentMethod: z.enum(["credit_card", "pix", "boleto", "debit_online"]),
  trialDays: z.number().nonnegative().optional(),
  creditPackId: z.string().optional()
});

export type PagBankCheckoutPayload = z.infer<typeof paymentPayloadSchema>;

export interface PagBankCheckoutSessionInput extends PagBankCheckoutPayload {
  amountCents: number;
  productName: string;
  referenceId: string;
}

export type PagBankPayloadLike = Record<string, unknown>;

interface PagBankCheckoutLink {
  rel?: string;
  href?: string;
  method?: string;
}

export function parseCheckoutPayload(payload: unknown) {
  return paymentPayloadSchema.parse(payload);
}

function getPagBankApiUrl() {
  return process.env.PAGBANK_API_URL || "https://sandbox.api.pagseguro.com";
}

function getPagBankRecurrenceApiUrl() {
  return (
    process.env.PAGBANK_RECURRENCE_API_URL ||
    "https://sandbox.api.assinaturas.pagseguro.com"
  );
}

function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

function isPagBankConfigured() {
  return Boolean(process.env.PAGBANK_SECRET_KEY);
}

async function pagBankFetch<T>(url: string) {
  if (!isPagBankConfigured()) {
    throw new Error("pagbank_not_configured");
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.PAGBANK_SECRET_KEY}`,
      Accept: "application/json"
    }
  });

  const data = (await response.json().catch(() => ({}))) as T & {
    error_messages?: Array<{ description?: string }>;
  };

  if (!response.ok) {
    throw new Error(
      data.error_messages?.map((item) => item.description).filter(Boolean).join(" | ") ||
        "pagbank_request_failed"
    );
  }

  return data;
}

function mapPaymentMethod(paymentMethod: PagBankCheckoutPayload["paymentMethod"]) {
  switch (paymentMethod) {
    case "credit_card":
      return "CREDIT_CARD";
    case "pix":
      return "PIX";
    case "boleto":
      return "BOLETO";
    case "debit_online":
      return "ONLINE_DEBIT";
    default:
      return "CREDIT_CARD";
  }
}

function buildRecurrencePlan(input: PagBankCheckoutSessionInput) {
  if (input.creditPackId || input.planId === "credits" || !input.trialDays) {
    return undefined;
  }

  return {
    interval: "MONTHLY",
    interval_length: 1,
    amount: {
      value: input.amountCents
    },
    trial: {
      period: input.trialDays
    }
  };
}

function getCheckoutLink(links: PagBankCheckoutLink[], relation: string) {
  return links.find((item) => item.rel === relation)?.href || null;
}

function buildCheckoutReturnUrl(input: PagBankCheckoutSessionInput) {
  const attemptId = input.referenceId.split(":").at(-1);
  const searchParams = new URLSearchParams();

  if (attemptId) {
    searchParams.set("attempt", attemptId);
  }

  if (input.planId) {
    searchParams.set("plan", input.planId);
  }

  const query = searchParams.toString();
  return `${getAppUrl()}/billing/success${query ? `?${query}` : ""}`;
}

export async function createPagBankCheckoutSession(input: PagBankCheckoutSessionInput) {
  if (!isPagBankConfigured()) {
    return {
      provider: "pagbank",
      environment: getPagBankApiUrl(),
      status: "pending_configuration",
      message:
        "Configure PAGBANK_SECRET_KEY para gerar um checkout real do PagBank.",
      redirectUrl: null,
      checkoutId: null,
      links: [],
      payload: input
    };
  }

  const response = await fetch(`${getPagBankApiUrl()}/checkouts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAGBANK_SECRET_KEY}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      "x-api-version": "4.0"
    },
    body: JSON.stringify({
      reference_id: input.referenceId,
      customer_modifiable: true,
      items: [
        {
          reference_id: input.creditPackId || input.planId,
          name: input.productName,
          quantity: 1,
          unit_amount: input.amountCents
        }
      ],
      payment_methods: [
        {
          type: mapPaymentMethod(input.paymentMethod)
        }
      ],
      notification_urls: [`${getAppUrl()}/api/billing/webhooks/pagbank`],
      payment_notification_urls: [`${getAppUrl()}/api/billing/webhooks/pagbank`],
      redirect_url: buildCheckoutReturnUrl(input),
      return_url: buildCheckoutReturnUrl(input),
      recurrence_plan: buildRecurrencePlan(input)
    })
  });

  const data = (await response.json().catch(() => ({}))) as {
    id?: string;
    code?: string;
    error_messages?: Array<{ code?: string; description?: string }>;
    links?: PagBankCheckoutLink[];
  };

  if (!response.ok) {
    const providerMessage =
      data.error_messages?.map((item) => item.description).filter(Boolean).join(" | ") ||
      "pagbank_checkout_failed";
    throw new Error(providerMessage);
  }

  const links = data.links || [];
  const redirectUrl =
    getCheckoutLink(links, "PAY") ||
    getCheckoutLink(links, "SELF") ||
    getCheckoutLink(links, "PAYMENT") ||
    null;

  return {
    provider: "pagbank",
    environment: getPagBankApiUrl(),
    status: redirectUrl ? "ready" : "created_without_link",
    message: redirectUrl
      ? "Checkout PagBank criado com sucesso."
      : "Checkout criado, mas sem link de pagamento no retorno do provedor.",
    redirectUrl,
    checkoutId: data.id || data.code || null,
    links,
    payload: input,
    raw: data
  };
}

export async function fetchPagBankCheckout(checkoutId: string) {
  return pagBankFetch<PagBankPayloadLike>(`${getPagBankApiUrl()}/checkouts/${checkoutId}`);
}

export async function fetchPagBankSubscription(subscriptionId: string) {
  return pagBankFetch<PagBankPayloadLike>(
    `${getPagBankRecurrenceApiUrl()}/subscriptions/${subscriptionId}`
  );
}

export async function cancelPagBankSubscription(subscriptionId: string) {
  if (!isPagBankConfigured()) {
    throw new Error("pagbank_not_configured");
  }

  const response = await fetch(
    `${getPagBankRecurrenceApiUrl()}/subscriptions/${subscriptionId}/cancel`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${process.env.PAGBANK_SECRET_KEY}`,
        Accept: "application/json"
      }
    }
  );

  const data = (await response.json().catch(() => ({}))) as {
    error_messages?: Array<{ description?: string }>;
  };

  if (!response.ok) {
    throw new Error(
      data.error_messages?.map((item) => item.description).filter(Boolean).join(" | ") ||
        "pagbank_subscription_cancel_failed"
    );
  }

  return data;
}

export function verifyPagBankWebhook(payload: string, authenticityToken?: string | null) {
  if (!process.env.PAGBANK_SECRET_KEY || !authenticityToken) {
    return false;
  }

  const expectedA = crypto
    .createHash("sha256")
    .update(`${process.env.PAGBANK_SECRET_KEY}${payload}`)
    .digest("hex");
  const expectedB = crypto
    .createHash("sha256")
    .update(`${payload}${process.env.PAGBANK_SECRET_KEY}`)
    .digest("hex");

  return expectedA === authenticityToken || expectedB === authenticityToken;
}
