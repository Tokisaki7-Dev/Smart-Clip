import { NextResponse } from "next/server";

import { isSupabaseAdminConfigured } from "@/lib/env";
import { verifyPagBankWebhook } from "@/lib/pagbank";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const token = request.headers.get("x-smartclip-webhook-token");
  const body = await request.json();

  if (!verifyPagBankWebhook(token)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  if (isSupabaseAdminConfigured()) {
    const admin = createSupabaseAdminClient();
    const providerEventId =
      body?.id || body?.notificationCode || crypto.randomUUID();
    const eventType = body?.eventType || body?.type || "pagbank.event";

    await admin.from("payment_webhooks").upsert({
      provider: "pagbank",
      event_type: eventType,
      provider_event_id: String(providerEventId),
      payload: body,
      process_status: "pending"
    });
  }

  return NextResponse.json({
    ok: true,
    received: body,
    message:
      "Webhook recebido. Conecte persistencia em payment_webhooks e atualizacao de subscriptions."
  });
}
