import Link from "next/link";

import { createMetadata } from "@/lib/metadata";

import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const metadata = createMetadata({
  title: "Signup",
  description:
    "Cadastro no SmartClip com foco em conversao do gratis e passagem elegante para trial pago.",
  path: "/signup"
});

export default function SignupPage() {
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
          <div className="space-y-4">
            <Input placeholder="Nome" />
            <Input placeholder="Email" type="email" />
            <Input placeholder="Senha" type="password" />
            <Button className="w-full">Criar conta</Button>
          </div>
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
