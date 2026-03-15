import { NextResponse } from "next/server";
import { z } from "zod";

import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const jobSchema = z.object({
  toolSlug: z.string(),
  sourceFile: z.string().optional(),
  sourceVideoId: z.string().uuid().optional(),
  preset: z.string(),
  userId: z.string().optional()
});

function inferJobType(toolSlug: string) {
  if (toolSlug === "extrair-audio" || toolSlug === "mp4-para-mp3") {
    return "extract_audio";
  }

  if (toolSlug === "comprimir-video") {
    return "compress";
  }

  if (toolSlug === "converter-video" || toolSlug === "mov-para-mp4") {
    return "convert";
  }

  if (
    toolSlug === "video-para-reels" ||
    toolSlug === "video-para-shorts" ||
    toolSlug === "video-para-tiktok" ||
    toolSlug === "video-para-stories" ||
    toolSlug === "video-para-whatsapp"
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

  const { data, error } = await supabase
    .from("processing_jobs")
    .insert({
      user_id: user.id,
      video_id: payload.sourceVideoId || null,
      type: inferJobType(payload.toolSlug),
      status: "queued",
      queue_name: "processing_jobs",
      input: {
        toolSlug: payload.toolSlug,
        sourceFile: payload.sourceFile || null,
        preset: payload.preset
      }
    })
    .select("id, status, queue_name, type, created_at")
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
      ...payload
    }
  });
}
