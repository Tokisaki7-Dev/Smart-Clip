export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function isSupabaseAdminConfigured() {
  return Boolean(
    isSupabaseConfigured() && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export function getSupabaseStorageBucket() {
  return process.env.SUPABASE_STORAGE_BUCKET || "videos";
}
