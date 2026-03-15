import { NextResponse } from "next/server";
import { z } from "zod";

import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const completeExportSchema = z.object({
  exportId: z.string().uuid(),
  processingJobId: z.string().uuid().optional()
});

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { ok: false, error: "supabase_not_configured" },
      { status: 500 }
    );
  }

  const body = await request.json();
  const payload = completeExportSchema.parse(body);
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const { data: exportRecord, error } = await supabase
    .from("exports")
    .update({
      status: "completed"
    })
    .eq("id", payload.exportId)
    .eq("user_id", user.id)
    .select("id, status, storage_path, created_at")
    .single();

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  if (payload.processingJobId) {
    await supabase
      .from("processing_jobs")
      .update({
        status: "completed",
        finished_at: new Date().toISOString(),
        output: {
          exportId: exportRecord.id,
          storagePath: exportRecord.storage_path
        }
      })
      .eq("id", payload.processingJobId)
      .eq("user_id", user.id);
  }

  return NextResponse.json({ ok: true, export: exportRecord });
}
