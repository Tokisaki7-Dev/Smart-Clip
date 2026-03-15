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
  const checkoutPayload = {
    ...payload
  };

  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    const customerEmail = payload.customerEmail || user?.email || undefined;
    const amountCents = resolveAmountInCents(payload.planId, payload.creditPackId);
    const pack = payload.creditPackId ? getPackById(payload.creditPackId) : null;
    const session = createPagBankCheckoutSession({
      ...checkoutPayload,
      customerEmail
    });

    if (user) {
      await supabase.from("payment_attempts").insert({
        user_id: user.id,
        credit_pack_id: payload.creditPackId || null,
        payment_method: payload.paymentMethod,
        amount_cents: amountCents,
        status: "pending",
        raw_payload: {
          ...payload,
          customerEmail,
          productName: pack?.name || payload.planId
        }
      });
    }

    return NextResponse.json({
      ok: true,
      session
    });
  }

  const session = createPagBankCheckoutSession(payload);

  return NextResponse.json({
    ok: true,
    session
  });
}
