import Link from "next/link";

import { isSupabaseConfigured } from "@/lib/env";
import { createMetadata } from "@/lib/metadata";
import { loginAction } from "@/app/auth/actions";

import { SubmitButton } from "@/components/auth/submit-button";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const metadata = createMetadata({
  title: "Login",
  description: "Acesso ao SmartClip com Supabase Auth preparado para evolucao futura.",
  path: "/login"
});

interface LoginPageProps {
  searchParams: Promise<{ error?: string; message?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <PageShell>
      <Card className="mx-auto max-w-xl border-white/8 bg-white/[0.03]">
        <CardContent className="space-y-6 p-8">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.24em] text-primary">Entrar</p>
            <h1 className="font-display text-4xl text-white">Volte ao seu fluxo</h1>
            <p className="text-sm leading-7 text-muted-foreground">
              A base esta pronta para Supabase Auth com email magic link, senha e social login no futuro.
            </p>
          </div>
          {!isSupabaseConfigured() ? (
            <div className="rounded-[1.25rem] border border-amber-500/20 bg-amber-500/10 p-4 text-sm leading-7 text-amber-100">
              Configure `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`
              para ativar login real com Supabase Auth.
            </div>
          ) : null}
          {params.message ? (
            <div className="rounded-[1.25rem] border border-primary/20 bg-primary/10 p-4 text-sm text-white/85">
              {params.message}
            </div>
          ) : null}
          {params.error ? (
            <div className="rounded-[1.25rem] border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">
              {params.error}
            </div>
          ) : null}
          <form action={loginAction} className="space-y-4">
            <Input
              autoComplete="email"
              name="email"
              placeholder="Seu email"
              type="email"
            />
            <Input
              autoComplete="current-password"
              name="password"
              placeholder="Sua senha"
              type="password"
            />
            <SubmitButton>Entrar</SubmitButton>
          </form>
          <p className="text-sm text-muted-foreground">
            Ainda nao tem conta?{" "}
            <Link className="text-primary" href="/signup">
              Crie gratis
            </Link>
          </p>
        </CardContent>
      </Card>
    </PageShell>
  );
}
