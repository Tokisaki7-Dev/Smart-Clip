import { NextResponse } from "next/server";
import { z } from "zod";

import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const uploadCompleteSchema = z.object({
  videoId: z.string().uuid(),
  durationSeconds: z.number().int().nonnegative().optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional()
});

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { ok: false, error: "supabase_not_configured" },
      { status: 500 }
    );
  }

  const body = await request.json();
  const payload = uploadCompleteSchema.parse(body);
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("videos")
    .update({
      status: "ready",
      duration_seconds: payload.durationSeconds || null,
      width: payload.width || null,
      height: payload.height || null
    })
    .eq("id", payload.videoId)
    .eq("user_id", user.id)
    .select("id, status, duration_seconds, width, height")
    .single();

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    video: data
  });
}
