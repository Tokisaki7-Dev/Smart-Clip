import { NextResponse } from "next/server";
import { z } from "zod";

import { getSupabaseStorageBucket, isSupabaseConfigured } from "@/lib/env";
import {
  getRetentionEndsAt,
  normalizePlanId,
  uploadLimits
} from "@/lib/plan-rules";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const uploadSchema = z.object({
  fileName: z.string(),
  mimeType: z.string(),
  sizeBytes: z.number().int().positive().optional()
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
  const payload = uploadSchema.parse(body);
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("users")
    .select("current_plan")
    .eq("id", user.id)
    .maybeSingle();
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const planId = normalizePlanId(subscription?.plan_id || profile?.current_plan);
  const sizeLimit = uploadLimits[planId];

  if (payload.sizeBytes && payload.sizeBytes > sizeLimit) {
    return NextResponse.json(
      {
        ok: false,
        error: "file_too_large",
        limitBytes: sizeLimit
      },
      { status: 400 }
    );
  }

  const bucket = getSupabaseStorageBucket();
  const storagePath = `${user.id}/${Date.now()}-${sanitizeFileName(payload.fileName)}`;
  const { data: signedUpload, error: signedUploadError } = await supabase.storage
    .from(bucket)
    .createSignedUploadUrl(storagePath);

  if (signedUploadError || !signedUpload) {
    return NextResponse.json(
      { ok: false, error: signedUploadError?.message || "upload_url_failed" },
      { status: 500 }
    );
  }

  const { data: video, error: videoError } = await supabase
    .from("videos")
    .insert({
      user_id: user.id,
      storage_bucket: bucket,
      storage_path: storagePath,
      original_name: payload.fileName,
      mime_type: payload.mimeType,
      size_bytes: payload.sizeBytes || 0,
      source_format: payload.fileName.split(".").pop()?.toLowerCase() || null,
      status: "uploading",
      retention_ends_at: getRetentionEndsAt(planId)
    })
    .select("id, storage_path, storage_bucket, status")
    .single();

  if (videoError) {
    return NextResponse.json({ ok: false, error: videoError.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    storageProvider: "supabase-storage",
    bucket,
    limitBytes: sizeLimit,
    video,
    upload: signedUpload
  });
}
