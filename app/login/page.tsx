import Link from "next/link";

import { createMetadata } from "@/lib/metadata";

import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const metadata = createMetadata({
  title: "Login",
  description: "Acesso ao SmartClip com Supabase Auth preparado para evolucao futura.",
  path: "/login"
});

export default function LoginPage() {
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
          <div className="space-y-4">
            <Input placeholder="Seu email" type="email" />
            <Input placeholder="Sua senha" type="password" />
            <Button className="w-full">Entrar</Button>
          </div>
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
