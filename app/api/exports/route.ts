import { NextResponse } from "next/server";
import { z } from "zod";

import { getSupabaseStorageBucket, isSupabaseConfigured } from "@/lib/env";
import {
  dailyExportLimits,
  getRetentionEndsAt,
  normalizePlanId
} from "@/lib/plan-rules";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const exportSchema = z.object({
  fileName: z.string(),
  mimeType: z.string(),
  sizeBytes: z.number().int().positive(),
  toolSlug: z.string(),
  outputFormat: z.string(),
  resolution: z.string(),
  watermarkEnabled: z.boolean().optional(),
  videoId: z.string().uuid().optional(),
  processingJobId: z.string().uuid().optional()
});

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { ok: false, error: "supabase_not_configured" },
      { status: 500 }
    );
  }

  const body = await request.json();
  const payload = exportSchema.parse(body);
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const dayStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  ).toISOString();

  const [{ data: profile }, { data: subscription }, exportCountResult] =
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
        .from("exports")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", dayStart)
    ]);

  const planId = normalizePlanId(subscription?.plan_id || profile?.current_plan);
  const exportLimit = dailyExportLimits[planId];

  if (exportLimit !== Number.MAX_SAFE_INTEGER && (exportCountResult.count || 0) >= exportLimit) {
    return NextResponse.json(
      {
        ok: false,
        error: "daily_export_limit_reached",
        limit: exportLimit
      },
      { status: 400 }
    );
  }

  const bucket = getSupabaseStorageBucket();
  const storagePath = `${user.id}/exports/${Date.now()}-${sanitizeFileName(payload.fileName)}`;
  const { data: signedUpload, error: signedUploadError } = await supabase.storage
    .from(bucket)
    .createSignedUploadUrl(storagePath);

  if (signedUploadError || !signedUpload) {
    return NextResponse.json(
      { ok: false, error: signedUploadError?.message || "export_upload_url_failed" },
      { status: 500 }
    );
  }

  const { data: exportRecord, error } = await supabase
    .from("exports")
    .insert({
      user_id: user.id,
      video_id: payload.videoId || null,
      processing_job_id: payload.processingJobId || null,
      tool_slug: payload.toolSlug,
      output_format: payload.outputFormat,
      resolution: payload.resolution,
      watermark_enabled: payload.watermarkEnabled ?? false,
      storage_path: storagePath,
      status: "processing",
      expires_at: getRetentionEndsAt(planId)
    })
    .select("id, storage_path, status, created_at")
    .single();

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    bucket,
    upload: signedUpload,
    export: exportRecord
  });
}
