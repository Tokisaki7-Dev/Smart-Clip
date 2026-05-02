import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";

const enhanceSchema = z.object({
  videoId: z.string().uuid(),
  applyUpscaling: z.boolean().default(false),
  sharpnessLevel: z.number().min(0).max(1).default(0.5),
  noiseReduction: z.boolean().default(true),
  contrastBoost: z.number().min(0).max(1).default(0.1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { videoId, applyUpscaling, sharpnessLevel, noiseReduction, contrastBoost } = enhanceSchema.parse(body);

    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Verificar se o vídeo existe e pertence ao usuário
    const { data: video } = await supabase.from("Video").select("*").eq("id", videoId).eq("userId", user.id).single();
    if (!video) return NextResponse.json({ error: "Video not found" }, { status: 404 });

    // Criar job no banco
    const { data: job, error } = await supabase.from("ProcessingJob").insert({
      userId: user.id,
      videoId,
      type: "ENHANCE",
      status: "QUEUED",
      metadata: { applyUpscaling, sharpnessLevel, noiseReduction, contrastBoost },
    }).select().single();
    if (error) throw error;

    // Iniciar worker (simular chamada; em produção, use um job queue como Bull)
    // Para progresso, usar Supabase Realtime para emitir updates no canal `job-${job.id}`

    return NextResponse.json({ jobId: job.id, message: "Enhancement job started" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}