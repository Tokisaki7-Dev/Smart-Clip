import { NextResponse } from "next/server";

import { verifyPagBankWebhook } from "@/lib/pagbank";

export async function POST(request: Request) {
  const token = request.headers.get("x-smartclip-webhook-token");
  const body = await request.json();

  if (!verifyPagBankWebhook(token)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    ok: true,
    received: body,
    message:
      "Webhook recebido. Conecte persistencia em payment_webhooks e atualizacao de subscriptions."
  });
}
