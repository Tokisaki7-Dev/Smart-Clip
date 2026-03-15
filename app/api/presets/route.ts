import { NextResponse } from "next/server";
import { z } from "zod";

import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const presetSchema = z.object({
  toolSlug: z.string(),
  name: z.string().min(2).max(80),
  config: z.object({
    preset: z.string(),
    outputFormat: z.string(),
    qualityMode: z.string()
  })
});

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { ok: false, error: "supabase_not_configured" },
      { status: 500 }
    );
  }

  const body = await request.json();
  const payload = presetSchema.parse(body);
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const { data: existingPreset } = await supabase
    .from("saved_presets")
    .select("id, usage_count")
    .eq("user_id", user.id)
    .eq("tool_slug", payload.toolSlug)
    .eq("name", payload.name)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextValues = {
    user_id: user.id,
    tool_slug: payload.toolSlug,
    name: payload.name,
    config: payload.config,
    usage_count: (existingPreset?.usage_count || 0) + 1,
    last_used_at: new Date().toISOString()
  };

  if (existingPreset) {
    const { data, error } = await supabase
      .from("saved_presets")
      .update(nextValues)
      .eq("id", existingPreset.id)
      .eq("user_id", user.id)
      .select("id, name, tool_slug, usage_count, last_used_at")
      .single();

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, preset: data });
  }

  const { data, error } = await supabase
    .from("saved_presets")
    .insert(nextValues)
    .select("id, name, tool_slug, usage_count, last_used_at")
    .single();

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, preset: data });
}
