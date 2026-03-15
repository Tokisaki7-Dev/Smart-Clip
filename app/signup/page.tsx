import Link from "next/link";

import { isSupabaseConfigured } from "@/lib/env";
import { createMetadata } from "@/lib/metadata";
import { signupAction } from "@/app/auth/actions";

import { SubmitButton } from "@/components/auth/submit-button";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const metadata = createMetadata({
  title: "Signup",
  description:
    "Cadastro no SmartClip com foco em conversao do gratis e passagem elegante para trial pago.",
  path: "/signup"
});

interface SignupPageProps {
  searchParams: Promise<{ error?: string; message?: string }>;
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = await searchParams;

  return (
    <PageShell>
      <Card className="mx-auto max-w-xl border-primary/20 bg-[#081227]/90 shadow-glow">
        <CardContent className="space-y-6 p-8">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.24em] text-primary">Testar gratis</p>
            <h1 className="font-display text-4xl text-white">Crie sua conta SmartClip</h1>
            <p className="text-sm leading-7 text-muted-foreground">
              O cadastro foi pensado para ativar o plano Free, deixar valor claro
              desde o primeiro upload e preparar o caminho para trial do Starter.
            </p>
          </div>
          {!isSupabaseConfigured() ? (
            <div className="rounded-[1.25rem] border border-amber-500/20 bg-amber-500/10 p-4 text-sm leading-7 text-amber-100">
              Configure as variaveis do Supabase para ativar cadastro real e sincronizar usuarios no banco.
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
          <form action={signupAction} className="space-y-4">
            <Input autoComplete="name" name="fullName" placeholder="Nome" />
            <Input
              autoComplete="email"
              name="email"
              placeholder="Email"
              type="email"
            />
            <Input
              autoComplete="new-password"
              name="password"
              placeholder="Senha"
              type="password"
            />
            <SubmitButton>Criar conta</SubmitButton>
          </form>
          <p className="text-sm text-muted-foreground">
            Ja tem conta?{" "}
            <Link className="text-primary" href="/login">
              Entrar
            </Link>
          </p>
        </CardContent>
      </Card>
    </PageShell>
  );
}
