import { redirect } from "next/navigation";

import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getOptionalUser() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return user;
}

export async function requireUser() {
  const user = await getOptionalUser();

  if (!user) {
    redirect("/login?message=Entre para acessar seu dashboard.");
  }

  return user;
}
