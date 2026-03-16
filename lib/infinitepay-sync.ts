import { addMonths } from "date-fns";

import { normalizePlanId } from "@/lib/plan-rules";
import { checkInfinitePayPayment } from "@/lib/infinitepay";
import type { SupabaseClient } from "@supabase/supabase-js";

type AdminClient = SupabaseClient;

function planFromAttempt(rawPayload: Record<string, unknown> | null | undefined) {
  const planId = typeof rawPayload?.planId === "string" ? rawPayload.planId : "free";
  return normalizePlanId(planId);
}

function isCreditPurchase(rawPayload: Record<string, unknown> | null | undefined) {
  return Boolean(
    typeof rawPayload?.creditPackId === "string" && rawPayload.creditPackId
  );
}

function resolveCreditAmount(creditPackId?: string | null) {
  switch (creditPackId) {
    case "pack-10":
      return 10;
    case "pack-30":
      return 30;
    case "pack-80":
      return 80;
    default:
      return 0;
  }
}

async function grantCredits(admin: AdminClient, input: {
  userId: string;
  walletId: string;
  attemptId: string;
  transactionId: string;
  creditPackId?: string | null;
}) {
  const amount = resolveCreditAmount(input.creditPackId);

  if (amount <= 0) {
    return;
  }

  const existingTransaction = await admin
    .from("credit_transactions")
    .select("id")
    .eq("user_id", input.userId)
    .eq("source_type", "infinitepay")
    .eq("source_id", input.transactionId)
    .maybeSingle();

  if (existingTransaction.data?.id) {
    return;
  }

  const walletResult = await admin
    .from("credit_wallets")
    .select("balance, lifetime_purchased, lifetime_spent")
    .eq("id", input.walletId)
    .single();

  if (walletResult.error || !walletResult.data) {
    throw new Error(walletResult.error?.message || "credit_wallet_not_found");
  }

  const balanceAfter = walletResult.data.balance + amount;

  const walletUpdate = await admin
    .from("credit_wallets")
    .update({
      balance: balanceAfter,
      lifetime_purchased: walletResult.data.lifetime_purchased + amount
    })
    .eq("id", input.walletId)
    .eq("user_id", input.userId);

  if (walletUpdate.error) {
    throw new Error(walletUpdate.error.message);
  }

  const transactionInsert = await admin.from("credit_transactions").insert({
    wallet_id: input.walletId,
    user_id: input.userId,
    type: "purchase",
    amount,
    balance_after: balanceAfter,
    source_type: "infinitepay",
    source_id: input.transactionId,
    metadata: {
      attemptId: input.attemptId,
      creditPackId: input.creditPackId || null
    }
  });

  if (transactionInsert.error) {
    throw new Error(transactionInsert.error.message);
  }
}

async function activatePlan(admin: AdminClient, input: {
  userId: string;
  attemptId: string;
  transactionId: string;
  rawPayload?: Record<string, unknown> | null;
}) {
  const planId = planFromAttempt(input.rawPayload);
  const now = new Date();

  const existingSubscriptionResult = await admin
    .from("subscriptions")
    .select("id, plan_id, current_period_end")
    .eq("user_id", input.userId)
    .in("status", ["trial", "active", "past_due"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingSubscriptionResult.error) {
    throw new Error(existingSubscriptionResult.error.message);
  }

  const existingSubscription = existingSubscriptionResult.data;
  const startDate =
    existingSubscription?.plan_id === planId &&
    existingSubscription.current_period_end &&
    new Date(existingSubscription.current_period_end).getTime() > now.getTime()
      ? new Date(existingSubscription.current_period_end)
      : now;
  const endDate = addMonths(startDate, 1);

  let subscriptionId = existingSubscription?.id || null;

  const subscriptionPayload = {
    user_id: input.userId,
    plan_id: planId,
    status: "active" as const,
    provider: "manual" as const,
    external_id: input.transactionId,
    current_period_start: startDate.toISOString(),
    current_period_end: endDate.toISOString(),
    canceled_at: null,
    cancel_at_period_end: false,
    updated_at: new Date().toISOString()
  };

  if (subscriptionId) {
    const updateResult = await admin
      .from("subscriptions")
      .update(subscriptionPayload)
      .eq("id", subscriptionId)
      .eq("user_id", input.userId)
      .select("id")
      .single();

    if (updateResult.error || !updateResult.data) {
      throw new Error(updateResult.error?.message || "subscription_update_failed");
    }

    subscriptionId = updateResult.data.id;
  } else {
    const insertResult = await admin
      .from("subscriptions")
      .insert(subscriptionPayload)
      .select("id")
      .single();

    if (insertResult.error || !insertResult.data) {
      throw new Error(insertResult.error?.message || "subscription_insert_failed");
    }

    subscriptionId = insertResult.data.id;
  }

  const attemptUpdate = await admin
    .from("payment_attempts")
    .update({
      subscription_id: subscriptionId
    })
    .eq("id", input.attemptId)
    .eq("user_id", input.userId);

  if (attemptUpdate.error) {
    throw new Error(attemptUpdate.error.message);
  }

  const userUpdate = await admin
    .from("users")
    .update({
      current_plan: planId,
      updated_at: new Date().toISOString()
    })
    .eq("id", input.userId);

  if (userUpdate.error) {
    throw new Error(userUpdate.error.message);
  }
}

export async function syncInfinitePayState(input: {
  admin: AdminClient;
  attemptId: string;
  orderNsu?: string | null;
  transactionNsu?: string | null;
  slug?: string | null;
  providerPayload?: Record<string, unknown> | null;
}) {
  const attemptResult = await input.admin
    .from("payment_attempts")
    .select("id, user_id, credit_pack_id, status, raw_payload, amount_cents")
    .eq("id", input.attemptId)
    .maybeSingle();

  if (attemptResult.error || !attemptResult.data) {
    throw new Error(attemptResult.error?.message || "payment_attempt_not_found");
  }

  const attempt = attemptResult.data;
  const rawPayload =
    attempt.raw_payload && typeof attempt.raw_payload === "object"
      ? (attempt.raw_payload as Record<string, unknown>)
      : null;
  const orderNsu = input.orderNsu || attempt.id;
  const transactionNsu =
    input.transactionNsu ||
    (typeof input.providerPayload?.transaction_nsu === "string"
      ? input.providerPayload.transaction_nsu
      : null);
  const slug =
    input.slug ||
    (typeof input.providerPayload?.slug === "string" ? input.providerPayload.slug : null);

  let paid = false;
  let providerResponse: Record<string, unknown> | null =
    input.providerPayload || null;

  if (transactionNsu && slug) {
    providerResponse = await checkInfinitePayPayment({
      orderNsu,
      transactionNsu,
      slug
    });
    paid = Boolean(providerResponse?.paid || providerResponse?.success);
  } else if (input.providerPayload) {
    paid = true;
  }

  const status = paid ? "paid" : "pending";

  const attemptUpdate = await input.admin
    .from("payment_attempts")
    .update({
      status,
      provider: "manual",
      provider_payment_id: transactionNsu || slug || orderNsu,
      failure_reason: paid ? null : "payment_pending_confirmation",
      raw_payload: {
        ...(rawPayload || {}),
        provider: "infinitepay",
        providerResponse,
        orderNsu,
        transactionNsu,
        slug
      }
    })
    .eq("id", attempt.id)
    .eq("user_id", attempt.user_id);

  if (attemptUpdate.error) {
    throw new Error(attemptUpdate.error.message);
  }

  if (!paid) {
    return {
      attemptStatus: status
    };
  }

  const walletResult = await input.admin
    .from("credit_wallets")
    .select("id")
    .eq("user_id", attempt.user_id)
    .maybeSingle();

  if (walletResult.error || !walletResult.data) {
    throw new Error(walletResult.error?.message || "credit_wallet_not_found");
  }

  if (isCreditPurchase(rawPayload)) {
    await grantCredits(input.admin, {
      userId: attempt.user_id,
      walletId: walletResult.data.id,
      attemptId: attempt.id,
      transactionId: transactionNsu || slug || orderNsu,
      creditPackId: attempt.credit_pack_id
    });

    return {
      attemptStatus: status
    };
  }

  await activatePlan(input.admin, {
    userId: attempt.user_id,
    attemptId: attempt.id,
    transactionId: transactionNsu || slug || orderNsu,
    rawPayload
  });

  return {
    attemptStatus: status
  };
}
