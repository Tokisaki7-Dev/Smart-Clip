import crypto from "node:crypto";

import { NextResponse } from "next/server";

import { isSupabaseAdminConfigured } from "@/lib/env";
import { syncPagBankState } from "@/lib/pagbank-sync";
import { verifyPagBankWebhook } from "@/lib/pagbank";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

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

  if (reference?.paymentAttemptId) {
    await syncPagBankState({
      admin,
      attemptId: reference.paymentAttemptId,
      fallbackUserId: reference.userId,
      providerPayload: body
    });
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
