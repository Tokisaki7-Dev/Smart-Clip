import { z } from "zod";

const checkoutPayloadSchema = z.object({
  planId: z.string(),
  customerEmail: z.string().email().optional(),
  paymentMethod: z.enum(["credit_card", "pix", "boleto", "debit_online"]),
  trialDays: z.number().nonnegative().optional(),
  creditPackId: z.string().optional()
});

export type InfinitePayCheckoutPayload = z.infer<typeof checkoutPayloadSchema>;

export interface InfinitePayCheckoutSessionInput extends InfinitePayCheckoutPayload {
  amountCents: number;
  productName: string;
  referenceId: string;
}

interface InfinitePayLinkResponse {
  url?: string;
  id?: string;
  slug?: string;
  error?: string;
  message?: string;
}

function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

function getInfinitePayApiUrl() {
  return process.env.INFINITEPAY_API_URL || "https://api.infinitepay.io";
}

function getInfinitePayCheckoutLink() {
  return process.env.INFINITEPAY_CHECKOUT_LINK || "";
}

function getInfinitePayHandle() {
  const directHandle = process.env.INFINITEPAY_HANDLE;

  if (directHandle) {
    return directHandle.replace(/^\$/, "").trim();
  }

  const checkoutLink = getInfinitePayCheckoutLink();

  if (!checkoutLink) {
    return "";
  }

  try {
    const parsedUrl = new URL(checkoutLink);
    const segments = parsedUrl.pathname.split("/").filter(Boolean);
    return segments[0] || "";
  } catch {
    return "";
  }
}

export function isInfinitePayConfigured() {
  return Boolean(getInfinitePayHandle() || getInfinitePayCheckoutLink());
}

export function parseCheckoutPayload(payload: unknown) {
  return checkoutPayloadSchema.parse(payload);
}

function buildCheckoutReturnUrl(input: InfinitePayCheckoutSessionInput) {
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

function buildWebhookUrl() {
  return `${getAppUrl()}/api/billing/webhooks/infinitepay`;
}

export async function createInfinitePayCheckoutSession(
  input: InfinitePayCheckoutSessionInput
) {
  const handle = getInfinitePayHandle();

  if (!handle) {
    return {
      provider: "infinitepay",
      status: "pending_configuration",
      message:
        "Configure INFINITEPAY_HANDLE ou INFINITEPAY_CHECKOUT_LINK para gerar um checkout real da InfinitePay.",
      redirectUrl: null,
      checkoutId: null,
      payload: input
    };
  }

  const response = await fetch(`${getInfinitePayApiUrl()}/invoices/public/checkout/links`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      handle,
      redirect_url: buildCheckoutReturnUrl(input),
      webhook_url: buildWebhookUrl(),
      order_nsu: input.referenceId.split(":").at(-1),
      customer: input.customerEmail
        ? {
            email: input.customerEmail
          }
        : undefined,
      items: [
        {
          quantity: 1,
          price: input.amountCents,
          description: input.productName
        }
      ]
    })
  });

  const data = (await response.json().catch(() => ({}))) as InfinitePayLinkResponse;

  if (!response.ok) {
    throw new Error(data.message || data.error || "infinitepay_checkout_failed");
  }

  return {
    provider: "infinitepay",
    status: data.url ? "ready" : "created_without_link",
    message: data.url
      ? "Checkout InfinitePay criado com sucesso."
      : "Checkout criado, mas sem link de pagamento no retorno do provedor.",
    redirectUrl: data.url || getInfinitePayCheckoutLink() || null,
    checkoutId: data.slug || data.id || input.referenceId.split(":").at(-1) || null,
    payload: input,
    raw: data
  };
}

export async function checkInfinitePayPayment(input: {
  orderNsu: string;
  transactionNsu: string;
  slug: string;
}) {
  const handle = getInfinitePayHandle();

  if (!handle) {
    throw new Error("infinitepay_not_configured");
  }

  const response = await fetch(`${getInfinitePayApiUrl()}/invoices/public/checkout/payment_check`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      handle,
      order_nsu: input.orderNsu,
      transaction_nsu: input.transactionNsu,
      slug: input.slug
    })
  });

  const data = (await response.json().catch(() => ({}))) as {
    success?: boolean;
    paid?: boolean;
    amount?: number;
    paid_amount?: number;
    installments?: number;
    capture_method?: string;
    message?: string;
    error?: string;
  };

  if (!response.ok) {
    throw new Error(data.message || data.error || "infinitepay_payment_check_failed");
  }

  return data;
}
