import { NextResponse } from "next/server";

import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

interface ExportDownloadRouteProps {
  params: Promise<{
    exportId: string;
  }>;
}

export async function GET(_: Request, { params }: ExportDownloadRouteProps) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { ok: false, error: "supabase_not_configured" },
      { status: 500 }
    );
  }

  const { exportId } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login?message=Entre para baixar sua exportacao.", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
  }

  const { data: exportRecord, error } = await supabase
    .from("exports")
    .select("id, storage_path, user_id")
    .eq("id", exportId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !exportRecord) {
    return NextResponse.json({ ok: false, error: "export_not_found" }, { status: 404 });
  }

  const { data: signedUrl, error: signedUrlError } = await supabase.storage
    .from(process.env.SUPABASE_STORAGE_BUCKET || "videos")
    .createSignedUrl(exportRecord.storage_path, 60 * 10);

  if (signedUrlError || !signedUrl?.signedUrl) {
    return NextResponse.json(
      { ok: false, error: signedUrlError?.message || "signed_url_failed" },
      { status: 500 }
    );
  }

  return NextResponse.redirect(signedUrl.signedUrl);
}
