"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { isSupabaseConfigured } from "@/lib/env";
import { absoluteUrl } from "@/lib/utils";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function loginAction(formData: FormData) {
  if (!isSupabaseConfigured()) {
    redirect("/login?error=Supabase%20nao%20configurado.");
  }

  const email = getString(formData, "email");
  const password = getString(formData, "password");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signupAction(formData: FormData) {
  if (!isSupabaseConfigured()) {
    redirect("/signup?error=Supabase%20nao%20configurado.");
  }

  const email = getString(formData, "email");
  const password = getString(formData, "password");
  const fullName = getString(formData, "fullName");

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName
      },
      emailRedirectTo: absoluteUrl("/auth/callback?next=/dashboard")
    }
  });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");

  if (data.session) {
    redirect("/dashboard");
  }

  redirect(
    "/login?message=Conta criada. Verifique seu email para confirmar o acesso."
  );
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
