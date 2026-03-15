import { NextResponse } from "next/server";
import { z } from "zod";

const uploadSchema = z.object({
  planId: z.enum(["free", "starter", "creator", "pro"]),
  fileName: z.string(),
  mimeType: z.string()
});

const uploadLimits = {
  free: "800MB",
  starter: "2.5GB",
  creator: "8GB",
  pro: "25GB"
} as const;

export async function POST(request: Request) {
  const body = await request.json();
  const payload = uploadSchema.parse(body);

  return NextResponse.json({
    ok: true,
    storageProvider: "supabase-storage",
    signedUploadPlaceholder: true,
    limit: uploadLimits[payload.planId],
    nextStep:
      "Troque este placeholder por signed upload URL do Supabase Storage e persistencia em videos."
  });
}
