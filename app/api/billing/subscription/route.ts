import { NextResponse } from "next/server";
import { z } from "zod";

import { isSupabaseConfigured } from "@/lib/env";
import { cancelPagBankSubscription } from "@/lib/pagbank";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const subscriptionActionSchema = z.object({
  action: z.enum(["cancel"])
});

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { ok: false, error: "supabase_not_configured" },
      { status: 500 }
    );
  }

  const body = await request.json();
  subscriptionActionSchema.parse(body);

  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("id, status, external_id")
    .eq("user_id", user.id)
    .in("status", ["trial", "active", "past_due"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!subscription) {
    return NextResponse.json(
      { ok: false, error: "subscription_not_found" },
      { status: 404 }
    );
  }

  if (subscription.external_id) {
    try {
      await cancelPagBankSubscription(subscription.external_id);
    } catch (error) {
      return NextResponse.json(
        {
          ok: false,
          error:
            error instanceof Error
              ? error.message
              : "pagbank_subscription_cancel_failed"
        },
        { status: 400 }
      );
    }
  }

  const { data, error } = await supabase
    .from("subscriptions")
    .update({
      cancel_at_period_end: true,
      canceled_at: new Date().toISOString()
    })
    .eq("id", subscription.id)
    .eq("user_id", user.id)
    .select("id, status, cancel_at_period_end, canceled_at")
    .single();

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, subscription: data });
}
