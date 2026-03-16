import { NextResponse } from "next/server";

import { isSupabaseConfigured } from "@/lib/env";
import {
  createPagBankCheckoutSession,
  parseCheckoutPayload
} from "@/lib/pagbank";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getPackById } from "@/services/credits";
import { plans } from "@/services/plans";

function resolveAmountInCents(planId: string, creditPackId?: string | null) {
  if (creditPackId) {
    switch (creditPackId) {
      case "pack-10":
        return 1290;
      case "pack-30":
        return 2990;
      case "pack-80":
        return 5990;
      default:
        return 0;
    }
  }

  const plan = plans.find((item) => item.id === planId);
  return plan?.monthlyPrice ? Math.round(plan.monthlyPrice * 100) : 0;
}

export async function POST(request: Request) {
  const body = await request.json();
  const payload = parseCheckoutPayload(body);
  const amountCents = resolveAmountInCents(payload.planId, payload.creditPackId);
  const pack = payload.creditPackId ? getPackById(payload.creditPackId) : null;
  const productName = pack?.name || payload.planId;

  if (amountCents <= 0) {
    return NextResponse.json(
      { ok: false, error: "invalid_checkout_amount" },
      { status: 400 }
    );
  }
  let customerEmail = payload.customerEmail;
  let paymentAttemptId = crypto.randomUUID();
  let userId: string | null = null;

  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    customerEmail = customerEmail || user?.email || undefined;
    userId = user?.id || null;

    if (userId) {
      const attemptInsert = await supabase
        .from("payment_attempts")
        .insert({
          user_id: userId,
          credit_pack_id: payload.creditPackId || null,
          payment_method: payload.paymentMethod,
          amount_cents: amountCents,
          status: "pending",
          raw_payload: {
            ...payload,
            customerEmail,
            productName
          }
        })
        .select("id")
        .single();

      if (attemptInsert.data?.id) {
        paymentAttemptId = attemptInsert.data.id;
      }
    }
  }

  const referenceId = ["smartclip", userId || "guest", payload.planId, paymentAttemptId].join(":");
  const session = await createPagBankCheckoutSession({
    ...payload,
    customerEmail,
    amountCents,
    productName,
    referenceId
  });

  if (isSupabaseConfigured() && userId) {
    const supabase = await createSupabaseServerClient();

    await supabase
      .from("payment_attempts")
      .update({
        provider_payment_id: session.checkoutId || null,
        raw_payload: {
          ...payload,
          customerEmail,
          productName,
          referenceId,
          providerResponse: session.raw || session
        }
      })
      .eq("id", paymentAttemptId)
      .eq("user_id", userId);
  }

  return NextResponse.json({
    ok: true,
    session
  });
}
