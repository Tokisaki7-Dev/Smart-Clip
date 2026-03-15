import { NextResponse } from "next/server";
import { z } from "zod";

const jobSchema = z.object({
  toolSlug: z.string(),
  sourceFile: z.string(),
  preset: z.string(),
  userId: z.string().optional()
});

export async function POST(request: Request) {
  const body = await request.json();
  const payload = jobSchema.parse(body);

  return NextResponse.json({
    ok: true,
    job: {
      id: crypto.randomUUID(),
      status: "queued",
      queue: "supabase-table",
      worker: "ffmpeg-separate-worker",
      ...payload
    }
  });
}
