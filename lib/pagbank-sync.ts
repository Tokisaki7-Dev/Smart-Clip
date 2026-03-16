import { normalizePlanId } from "@/lib/plan-rules";
import {
  fetchPagBankCheckout,
  fetchPagBankSubscription,
  type PagBankPayloadLike
} from "@/lib/pagbank";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getPackById } from "@/services/credits";

type AdminClient = ReturnType<typeof createSupabaseAdminClient>;
type PaymentStatus = "pending" | "authorized" | "paid" | "failed" | "refunded" | "canceled";
type SubscriptionSyncStatus =
  | "trial"
  | "active"
  | "past_due"
  | "paused"
  | "canceled"
  | "expired";

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function walkValues(value: unknown, visitor: (node: Record<string, unknown>) => void) {
  if (!isPlainObject(value)) {
    return;
  }

  visitor(value);

  for (const nestedValue of Object.values(value)) {
    if (Array.isArray(nestedValue)) {
      nestedValue.forEach((item) => walkValues(item, visitor));
      continue;
    }

    walkValues(nestedValue, visitor);
  }
}

function findFirstStringByKeys(value: unknown, keys: string[]) {
  let result: string | null = null;
  const normalizedKeys = new Set(keys.map((item) => item.toLowerCase()));

  walkValues(value, (node) => {
    if (result) {
      return;
    }

    for (const [key, nodeValue] of Object.entries(node)) {
      if (!normalizedKeys.has(key.toLowerCase())) {
        continue;
      }

      if (typeof nodeValue === "string" && nodeValue.trim()) {
        result = nodeValue.trim();
        return;
      }
    }
  });

  return result;
}

function getTopLevelString(value: unknown, key: string) {
  if (!isPlainObject(value)) {
    return null;
  }

  const result = value[key];
  return typeof result === "string" && result.trim() ? result.trim() : null;
}

function parseDateCandidate(value?: string | null) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function mapPaymentStatus(value?: string | null): PaymentStatus {
  switch ((value || "").toUpperCase()) {
    case "PAID":
      return "paid";
    case "AUTHORIZED":
      return "authorized";
    case "IN_ANALYSIS":
    case "WAITING":
    case "PENDING":
      return "pending";
    case "CANCELED":
    case "CANCELLED":
      return "canceled";
    case "REFUNDED":
      return "refunded";
    case "DECLINED":
    case "DENIED":
    case "FAILED":
      return "failed";
    default:
      return "pending";
  }
}

function mapSubscriptionStatus(value?: string | null): SubscriptionSyncStatus | null {
  switch ((value || "").toUpperCase()) {
    case "ACTIVE":
    case "PAID":
      return "active";
    case "TRIAL":
      return "trial";
    case "OVERDUE":
    case "PAST_DUE":
    case "PENDING_ACTION":
      return "past_due";
    case "SUSPENDED":
      return "paused";
    case "CANCELED":
    case "CANCELLED":
      return "canceled";
    case "EXPIRED":
      return "expired";
    default:
      return null;
  }
}

function getProviderPaymentStatus(payload?: PagBankPayloadLike | null) {
  return mapPaymentStatus(
    findFirstStringByKeys(payload, [
      "payment_status",
      "status",
      "charge_status"
    ])
  );
}

function getProviderSubscriptionStatus(payload?: PagBankPayloadLike | null) {
  return mapSubscriptionStatus(
    findFirstStringByKeys(payload, [
      "subscription_status",
      "status",
      "charge_status"
    ])
  );
}

function parseReferenceId(referenceId?: string | null) {
  const parts = (referenceId || "").split(":");

  if (parts.length < 4 || parts[0] !== "smartclip") {
    return null;
  }

  return {
    userId: parts[1],
    planId: parts[2],
    paymentAttemptId: parts[3]
  };
}

function getSubscriptionIdFromPayload(payload?: PagBankPayloadLike | null) {
  return (
    findFirstStringByKeys(payload, ["subscription_id", "recurrence_id"]) ||
    getTopLevelString(payload, "subscription_id") ||
    getTopLevelString(payload, "recurrence_id")
  );
}

function getPaymentIdFromPayload(payload?: PagBankPayloadLike | null) {
  return (
    findFirstStringByKeys(payload, ["charge_id", "payment_id", "checkout_id"]) ||
    getTopLevelString(payload, "id")
  );
}

function getSubscriptionDates(payload?: PagBankPayloadLike | null) {
  const nextInvoiceAt = parseDateCandidate(
    findFirstStringByKeys(payload, [
      "next_invoice_at",
      "next_payment_at",
      "next_billing_at",
      "current_period_end",
      "current_period_end_at",
      "exp_at"
    ])
  );
  const trialEndsAt = parseDateCandidate(
    findFirstStringByKeys(payload, [
      "trial_end_at",
      "trial_ends_at",
      "trial_end_date"
    ])
  );
  const startAt = parseDateCandidate(
    findFirstStringByKeys(payload, [
      "created_at",
      "start_at",
      "current_period_start",
      "current_period_start_at"
    ])
  );

  return {
    currentPeriodStart: startAt,
    currentPeriodEnd: nextInvoiceAt,
    trialEndsAt
  };
}

function getFallbackPeriodEnd() {
  return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
}

function shouldGrantPlan(status: SubscriptionSyncStatus | null) {
  return status === "active" || status === "trial" || status === "past_due";
}

function shouldPersistSubscription(status: SubscriptionSyncStatus | null) {
  return Boolean(status);
}

async function ensureWallet(admin: AdminClient, userId: string) {
  const { data: wallet } = await admin
    .from("credit_wallets")
    .select("id, balance, lifetime_purchased")
    .eq("user_id", userId)
    .maybeSingle();

  if (wallet) {
    return wallet;
  }

  const inserted = await admin
    .from("credit_wallets")
    .insert({
      user_id: userId
    })
    .select("id, balance, lifetime_purchased")
    .single();

  if (inserted.error || !inserted.data) {
    throw new Error(inserted.error?.message || "wallet_create_failed");
  }

  return inserted.data;
}

async function applyCreditPurchase(params: {
  admin: AdminClient;
  userId: string;
  attemptId: string;
  providerPayload?: PagBankPayloadLike | null;
}) {
  const { admin, userId, attemptId, providerPayload } = params;
  const { data: attempt } = await admin
    .from("payment_attempts")
    .select("credit_pack_id")
    .eq("id", attemptId)
    .maybeSingle();
  const pack = attempt?.credit_pack_id ? getPackById(attempt.credit_pack_id) : null;

  if (!pack) {
    return;
  }

  const { data: existingTransaction } = await admin
    .from("credit_transactions")
    .select("id")
    .eq("source_type", "pagbank")
    .eq("source_id", attemptId)
    .maybeSingle();

  if (existingTransaction?.id) {
    return;
  }

  const wallet = await ensureWallet(admin, userId);
  const nextBalance = wallet.balance + pack.credits;

  await admin
    .from("credit_wallets")
    .update({
      balance: nextBalance,
      lifetime_purchased: wallet.lifetime_purchased + pack.credits
    })
    .eq("id", wallet.id);

  await admin.from("credit_transactions").insert({
    wallet_id: wallet.id,
    user_id: userId,
    type: "purchase",
    amount: pack.credits,
    balance_after: nextBalance,
    source_type: "pagbank",
    source_id: attemptId,
    metadata: providerPayload || {}
  });
}

export async function syncPagBankState(params: {
  admin: AdminClient;
  attemptId: string;
  fallbackUserId?: string | null;
  providerPayload?: PagBankPayloadLike | null;
}) {
  const { admin, attemptId, fallbackUserId = null, providerPayload = null } = params;
  const { data: attempt, error } = await admin
    .from("payment_attempts")
    .select("id, user_id, provider_payment_id, credit_pack_id, status, raw_payload, subscription_id")
    .eq("id", attemptId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!attempt) {
    return null;
  }

  const basePayload = isPlainObject(attempt.raw_payload) ? attempt.raw_payload : {};
  const reference =
    parseReferenceId(findFirstStringByKeys(providerPayload, ["reference_id", "referenceId"])) ||
    parseReferenceId(findFirstStringByKeys(basePayload, ["referenceId", "reference_id"]));
  const userId = attempt.user_id || reference?.userId || fallbackUserId;

  if (!userId) {
    throw new Error("billing_user_not_found");
  }

  let checkoutPayload = providerPayload;
  const checkoutId =
    attempt.provider_payment_id ||
    getPaymentIdFromPayload(providerPayload) ||
    findFirstStringByKeys(basePayload, ["provider_payment_id", "checkoutId"]);

  if (!checkoutPayload && checkoutId) {
    checkoutPayload = await fetchPagBankCheckout(checkoutId);
  }

  const mergedPayload = {
    ...basePayload,
    latestCheckout: checkoutPayload || null,
    latestWebhook: providerPayload || null
  } satisfies Record<string, unknown>;
  const paymentStatus = getProviderPaymentStatus(checkoutPayload || providerPayload || basePayload);

  const paymentUpdate = await admin
    .from("payment_attempts")
    .update({
      provider_payment_id:
        getPaymentIdFromPayload(checkoutPayload || providerPayload || basePayload) || checkoutId,
      status: paymentStatus,
      raw_payload: mergedPayload,
      failure_reason:
        paymentStatus === "failed" || paymentStatus === "canceled"
          ? findFirstStringByKeys(checkoutPayload || providerPayload, [
              "description",
              "message",
              "failure_reason"
            ])
          : null
    })
    .eq("id", attemptId)
    .select("id, status, payment_method, amount_cents, credit_pack_id, created_at")
    .single();

  if (paymentUpdate.error) {
    throw new Error(paymentUpdate.error.message);
  }

  const refreshedAttempt = paymentUpdate.data;

  if (reference?.planId === "credits" || attempt.credit_pack_id) {
    if (paymentStatus === "paid") {
      await applyCreditPurchase({
        admin,
        userId,
        attemptId,
        providerPayload: checkoutPayload || providerPayload
      });
    }

    return {
      attempt: refreshedAttempt,
      currentPlan: null,
      subscription: null
    };
  }

  const normalizedPlan = normalizePlanId(reference?.planId);
  const existingSubscriptionResult = await admin
    .from("subscriptions")
    .select("id, status, external_id, current_period_end")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingSubscriptionResult.error) {
    throw new Error(existingSubscriptionResult.error.message);
  }

  const existingSubscription = existingSubscriptionResult.data;

  const providerSubscriptionId =
    getSubscriptionIdFromPayload(providerPayload) ||
    getSubscriptionIdFromPayload(checkoutPayload) ||
    findFirstStringByKeys(basePayload, ["externalSubscriptionId", "subscription_id"]) ||
    existingSubscription?.external_id ||
    null;

  let subscriptionPayload: PagBankPayloadLike | null = null;
  if (providerSubscriptionId) {
    subscriptionPayload = await fetchPagBankSubscription(providerSubscriptionId);
  }

  const subscriptionStatus =
    getProviderSubscriptionStatus(subscriptionPayload) ||
    getProviderSubscriptionStatus(providerPayload) ||
    (paymentStatus === "paid" ? "active" : null);

  if (shouldPersistSubscription(subscriptionStatus)) {
    const dates = getSubscriptionDates(subscriptionPayload || providerPayload);
    const currentPeriodStart = dates.currentPeriodStart || new Date().toISOString();
    const currentPeriodEnd =
      subscriptionStatus === "canceled" || subscriptionStatus === "expired"
        ? dates.currentPeriodEnd || new Date().toISOString()
        : dates.currentPeriodEnd || existingSubscription?.current_period_end || getFallbackPeriodEnd();
    const trialEndsAt =
      subscriptionStatus === "trial" ? dates.trialEndsAt || currentPeriodEnd : null;

    const payload = {
      plan_id: normalizedPlan,
      status: subscriptionStatus,
      provider: "pagbank",
      external_id: providerSubscriptionId || existingSubscription?.external_id || null,
      current_period_start: currentPeriodStart,
      current_period_end: currentPeriodEnd,
      trial_ends_at: trialEndsAt,
      cancel_at_period_end:
        subscriptionStatus === "canceled" || subscriptionStatus === "expired",
      canceled_at:
        subscriptionStatus === "canceled" || subscriptionStatus === "expired"
          ? new Date().toISOString()
          : null
    };

    let subscriptionId = existingSubscription?.id || null;

    if (subscriptionId) {
      const updateResult = await admin
        .from("subscriptions")
        .update(payload)
        .eq("id", subscriptionId)
        .eq("user_id", userId)
        .select("id, plan_id, status, current_period_end, external_id")
        .single();

      if (updateResult.error) {
        throw new Error(updateResult.error.message);
      }

      subscriptionId = updateResult.data.id;
    } else {
      const insertResult = await admin
        .from("subscriptions")
        .insert({
          user_id: userId,
          ...payload
        })
        .select("id, plan_id, status, current_period_end, external_id")
        .single();

      if (insertResult.error) {
        throw new Error(insertResult.error.message);
      }

      subscriptionId = insertResult.data.id;
    }

    await admin
      .from("payment_attempts")
      .update({
        subscription_id: subscriptionId
      })
      .eq("id", attemptId);

    await admin
      .from("users")
      .update({
        current_plan: shouldGrantPlan(subscriptionStatus) ? normalizedPlan : "free"
      })
      .eq("id", userId);
  }

  const { data: profile } = await admin
    .from("users")
    .select("current_plan")
    .eq("id", userId)
    .maybeSingle();
  const { data: finalSubscription } = await admin
    .from("subscriptions")
    .select("id, plan_id, status, current_period_end, trial_ends_at, external_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return {
    attempt: refreshedAttempt,
    currentPlan: profile?.current_plan || "free",
    subscription: finalSubscription
  };
}
