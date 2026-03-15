import { createMetadata } from "@/lib/metadata";

import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/layout/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const metadata = createMetadata({
  title: "Contato",
  description: "Pagina de contato do SmartClip para suporte comercial, tecnico e parcerias.",
  path: "/contact"
});

export default function ContactPage() {
  return (
    <PageShell className="space-y-10">
      <SectionHeading
        eyebrow="Contato"
        title="Fale com vendas, suporte ou parceria"
        description="A base do SmartClip inclui pagina de contato limpa, clara e sem atrapalhar a jornada principal do produto."
      />

      <Card className="mx-auto max-w-3xl border-white/8 bg-white/[0.03]">
        <CardContent className="space-y-4 p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input placeholder="Nome" />
            <Input placeholder="Email" type="email" />
          </div>
          <Input placeholder="Assunto" />
          <Textarea placeholder="Como podemos ajudar?" />
          <Button>Enviar mensagem</Button>
        </CardContent>
      </Card>
    </PageShell>
  );
}
