import crypto from "node:crypto";

import { NextResponse } from "next/server";

import { isSupabaseAdminConfigured } from "@/lib/env";
import { syncInfinitePayState } from "@/lib/infinitepay-sync";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({ ok: true, skipped: "admin_not_configured" });
  }

  const orderNsu =
    typeof body.order_nsu === "string"
      ? body.order_nsu
      : typeof body.orderNsu === "string"
        ? body.orderNsu
        : null;
  const transactionNsu =
    typeof body.transaction_nsu === "string"
      ? body.transaction_nsu
      : typeof body.transactionNsu === "string"
        ? body.transactionNsu
        : null;
  const slug = typeof body.slug === "string" ? body.slug : null;
  const providerEventId = transactionNsu || orderNsu || slug || crypto.randomUUID();

  if (!orderNsu) {
    return NextResponse.json({ ok: false, error: "missing_order_nsu" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();

  await admin.from("payment_webhooks").upsert({
    provider: "manual",
    event_type: "infinitepay.payment",
    provider_event_id: String(providerEventId),
    payload: body,
    process_status: "processing"
  });

  await syncInfinitePayState({
    admin,
    attemptId: orderNsu,
    orderNsu,
    transactionNsu,
    slug,
    providerPayload: body
  });

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
