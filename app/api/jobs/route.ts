import { NextResponse } from "next/server";
import { z } from "zod";

import { isSupabaseConfigured } from "@/lib/env";
import { normalizePlanId } from "@/lib/plan-rules";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const jobSchema = z.object({
  toolSlug: z.string(),
  sourceFile: z.string().optional(),
  sourceVideoId: z.string().uuid().optional(),
  preset: z.string(),
  userId: z.string().optional(),
  mode: z.enum(["local", "premium"]).optional(),
  outputFormat: z.string().optional(),
  qualityMode: z.string().optional(),
  trimStart: z.number().nonnegative().optional(),
  trimEnd: z.number().nonnegative().optional(),
  duration: z.number().nonnegative().optional(),
  captionsRequested: z.boolean().optional(),
  multiClipCount: z.number().int().min(1).max(5).optional()
});

const monthlyAutomationLimits = {
  free: 3,
  starter: 25,
  creator: 120,
  pro: Number.MAX_SAFE_INTEGER
} as const;

const queuePriorities = {
  free: 0,
  starter: 1,
  creator: 2,
  pro: 3
} as const;

function inferJobType(payload: z.infer<typeof jobSchema>) {
  if (payload.mode === "premium") {
    return payload.captionsRequested ? "auto_caption" : "auto_clip";
  }

  if (payload.toolSlug === "video-para-clipe-com-legenda-automatica") {
    return "auto_caption";
  }

  if (payload.toolSlug === "extrair-audio" || payload.toolSlug === "mp4-para-mp3") {
    return "extract_audio";
  }

  if (payload.toolSlug === "comprimir-video") {
    return "compress";
  }

  if (payload.toolSlug === "converter-video" || payload.toolSlug === "mov-para-mp4") {
    return "convert";
  }

  if (
    payload.toolSlug === "video-para-reels" ||
    payload.toolSlug === "video-para-shorts" ||
    payload.toolSlug === "video-para-tiktok" ||
    payload.toolSlug === "video-para-stories" ||
    payload.toolSlug === "video-para-whatsapp"
  ) {
    return "resize";
  }

  return "trim";
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { ok: false, error: "supabase_not_configured" },
      { status: 500 }
    );
  }

  const body = await request.json();
  const payload = jobSchema.parse(body);
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const [profileResult, subscriptionResult] = await Promise.all([
    supabase
      .from("users")
      .select("current_plan")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("subscriptions")
      .select("plan_id")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()
  ]);

  const planId = normalizePlanId(
    subscriptionResult.data?.plan_id || profileResult.data?.current_plan
  );
  const jobType = inferJobType(payload);

  if (payload.mode === "premium" && (jobType === "auto_clip" || jobType === "auto_caption")) {
    const monthStart = new Date(
      Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1)
    ).toISOString();
    const monthlyLimit = monthlyAutomationLimits[planId];
    const usageResult = await supabase
      .from("processing_jobs")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("type", jobType)
      .gte("created_at", monthStart);

    if (
      monthlyLimit !== Number.MAX_SAFE_INTEGER &&
      (usageResult.count || 0) >= monthlyLimit
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "monthly_automation_limit_reached",
          limit: monthlyLimit,
          planId
        },
        { status: 400 }
      );
    }
  }

  const { data, error } = await supabase
    .from("processing_jobs")
    .insert({
      user_id: user.id,
      video_id: payload.sourceVideoId || null,
      type: jobType,
      status: "queued",
      queue_name: "processing_jobs",
      priority: queuePriorities[planId],
      input: {
        toolSlug: payload.toolSlug,
        sourceFile: payload.sourceFile || null,
        preset: payload.preset,
        mode: payload.mode || "local",
        outputFormat: payload.outputFormat || "mp4",
        qualityMode: payload.qualityMode || "balanced",
        trimStart: payload.trimStart ?? 0,
        trimEnd: payload.trimEnd ?? 0,
        duration: payload.duration ?? 0,
        captionsRequested: payload.captionsRequested ?? false,
        multiClipCount: payload.multiClipCount ?? 1
      }
    })
    .select("id, status, queue_name, type, created_at, priority")
    .single();

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    job: {
      id: data.id,
      status: data.status,
      queue: data.queue_name,
      worker: "ffmpeg-separate-worker",
      type: data.type,
      priority: data.priority,
      ...payload
    }
  });
}
