import { NextResponse } from "next/server";

import { isSupabaseAdminConfigured } from "@/lib/env";
import { normalizePlanId } from "@/lib/plan-rules";
import { verifyPagBankWebhook } from "@/lib/pagbank";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getPackById } from "@/services/credits";

function mapPaymentStatus(value?: string | null) {
  switch ((value || "").toUpperCase()) {
    case "PAID":
      return "paid";
    case "AUTHORIZED":
      return "authorized";
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

function mapSubscriptionStatus(value?: string | null) {
  switch ((value || "").toUpperCase()) {
    case "PAID":
    case "ACTIVE":
      return "active";
    case "TRIAL":
      return "trial";
    case "PAST_DUE":
      return "past_due";
    case "CANCELED":
    case "CANCELLED":
      return "canceled";
    default:
      return "active";
  }
}

function resolveSubscriptionStatus(params: {
  providerStatus: ReturnType<typeof mapPaymentStatus>;
  rawSubscriptionStatus?: string | null;
}) {
  const normalizedSubscriptionStatus = params.rawSubscriptionStatus
    ? mapSubscriptionStatus(params.rawSubscriptionStatus)
    : null;

  if (normalizedSubscriptionStatus === "trial") {
    return "trial" as const;
  }

  if (normalizedSubscriptionStatus === "active") {
    return params.providerStatus === "paid" ? ("active" as const) : null;
  }

  if (normalizedSubscriptionStatus === "past_due") {
    return "past_due" as const;
  }

  if (normalizedSubscriptionStatus === "canceled") {
    return "canceled" as const;
  }

  if (params.providerStatus === "paid") {
    return "active" as const;
  }

  return null;
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

function getNextBillingDate() {
  return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
}

async function ensureWallet(admin: ReturnType<typeof createSupabaseAdminClient>, userId: string) {
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

export async function POST(request: Request) {
  const payloadText = await request.text();
  const authenticityToken = request.headers.get("x-authenticity-token");
  const body = payloadText ? JSON.parse(payloadText) : {};

  if (!verifyPagBankWebhook(payloadText, authenticityToken)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({ ok: true, skipped: "admin_not_configured" });
  }

  const admin = createSupabaseAdminClient();
  const providerEventId =
    body?.id || body?.notificationCode || body?.charge_id || crypto.randomUUID();
  const eventType = body?.eventType || body?.type || "pagbank.event";
  const reference = parseReferenceId(body?.reference_id || body?.referenceId);

  await admin.from("payment_webhooks").upsert({
    provider: "pagbank",
    event_type: eventType,
    provider_event_id: String(providerEventId),
    payload: body,
    process_status: "processing"
  });

  const providerPaymentId =
    body?.id ||
    body?.charge_id ||
    body?.payment_response?.id ||
    body?.charges?.[0]?.id ||
    null;
  const providerStatus = mapPaymentStatus(
    body?.status ||
      body?.payment_status ||
      body?.charges?.[0]?.status ||
      body?.payment_response?.status
  );
  const nextSubscriptionStatus = resolveSubscriptionStatus({
    providerStatus,
    rawSubscriptionStatus: body?.subscription_status || body?.subscription?.status || body?.status
  });

  if (reference?.paymentAttemptId) {
    await admin
      .from("payment_attempts")
      .update({
        provider_payment_id: providerPaymentId,
        status: providerStatus,
        raw_payload: body
      })
      .eq("id", reference.paymentAttemptId);
  }

  if (reference?.userId && reference.planId !== "credits" && nextSubscriptionStatus) {
    const normalizedPlan = normalizePlanId(reference.planId);
    const externalSubscriptionId =
      body?.subscription_id || body?.subscription?.id || body?.recurrence_id || null;
    const currentPeriodStart = new Date().toISOString();
    const currentPeriodEnd =
      nextSubscriptionStatus === "canceled"
        ? new Date().toISOString()
        : getNextBillingDate();

    const { data: existingSubscription } = await admin
      .from("subscriptions")
      .select("id")
      .eq("user_id", reference.userId)
      .in("status", ["trial", "active", "past_due"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingSubscription?.id) {
      await admin
        .from("subscriptions")
        .update({
          plan_id: normalizedPlan,
          status: nextSubscriptionStatus,
          external_id: externalSubscriptionId,
          current_period_start: currentPeriodStart,
          current_period_end: currentPeriodEnd,
          cancel_at_period_end: nextSubscriptionStatus === "canceled",
          canceled_at:
            nextSubscriptionStatus === "canceled" ? new Date().toISOString() : null
        })
        .eq("id", existingSubscription.id);
    } else {
      await admin.from("subscriptions").insert({
        user_id: reference.userId,
        plan_id: normalizedPlan,
        status: nextSubscriptionStatus,
        provider: "pagbank",
        external_id: externalSubscriptionId,
        current_period_start: currentPeriodStart,
        current_period_end: currentPeriodEnd
      });
    }

    await admin
      .from("users")
      .update({
        current_plan: nextSubscriptionStatus === "canceled" ? "free" : normalizedPlan
      })
      .eq("id", reference.userId);
  }

  if (reference?.userId && reference.planId === "credits" && providerStatus === "paid") {
    const { data: attempt } = await admin
      .from("payment_attempts")
      .select("credit_pack_id")
      .eq("id", reference.paymentAttemptId)
      .maybeSingle();
    const pack = attempt?.credit_pack_id ? getPackById(attempt.credit_pack_id) : null;

    if (pack) {
      const wallet = await ensureWallet(admin, reference.userId);
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
        user_id: reference.userId,
        type: "purchase",
        amount: pack.credits,
        balance_after: nextBalance,
        source_type: "pagbank",
        source_id: reference.paymentAttemptId,
        metadata: body
      });
    }
  }

  await admin
    .from("payment_webhooks")
    .update({
      process_status: "processed",
      processed_at: new Date().toISOString()
    })
    .eq("provider_event_id", String(providerEventId));

  return NextResponse.json({
    ok: true,
    processed: true
  });
}
