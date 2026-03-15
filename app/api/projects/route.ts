import { NextResponse } from "next/server";
import { z } from "zod";

import {
  normalizePlanId,
  projectLimits
} from "@/lib/plan-rules";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const projectSchema = z.object({
  toolSlug: z.string(),
  videoId: z.string().uuid().optional(),
  lastExportId: z.string().uuid().optional(),
  name: z.string().min(2).max(120),
  config: z.object({
    preset: z.string(),
    outputFormat: z.string(),
    qualityMode: z.string(),
    trimStart: z.number().nonnegative(),
    trimEnd: z.number().nonnegative(),
    sourceFileName: z.string().optional()
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
  const payload = projectSchema.parse(body);
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const [{ data: profile }, { data: subscription }, { count: projectCount }] =
    await Promise.all([
      supabase.from("users").select("current_plan").eq("id", user.id).maybeSingle(),
      supabase
        .from("subscriptions")
        .select("plan_id")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("projects")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
    ]);

  const planId = normalizePlanId(subscription?.plan_id || profile?.current_plan);
  const projectLimit = projectLimits[planId];

  if (projectLimit !== Number.MAX_SAFE_INTEGER && (projectCount || 0) >= projectLimit) {
    return NextResponse.json(
      {
        ok: false,
        error: "project_limit_reached",
        limit: projectLimit
      },
      { status: 400 }
    );
  }

  const { data: project, error } = await supabase
    .from("projects")
    .insert({
      user_id: user.id,
      video_id: payload.videoId || null,
      last_export_id: payload.lastExportId || null,
      name: payload.name,
      tool_slug: payload.toolSlug,
      config: payload.config
    })
    .select("id, name, tool_slug, updated_at")
    .single();

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, project });
}
