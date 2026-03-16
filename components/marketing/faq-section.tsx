import { faqItems } from "@/services/plans";

import { SectionHeading } from "@/components/layout/section-heading";
import { Card, CardContent } from "@/components/ui/card";

export function FaqSection() {
  return (
    <section className="container py-20">
      <SectionHeading
        eyebrow="FAQ"
        title="Perguntas que ajudam a vender melhor porque deixam tudo mais claro"
        description="A proposta do SmartClip ficou mais forte, mas a clareza continua central. Usuario que entende limite, ganho e proximo passo costuma voltar mais e comprar com menos atrito."
      />

      <div className="mt-12 grid gap-4 lg:grid-cols-2">
        {faqItems.map((item) => (
          <Card className="border-white/10 bg-white/[0.035]" key={item.question}>
            <CardContent className="space-y-3 p-6">
              <h3 className="font-display text-xl text-white">{item.question}</h3>
              <p className="text-sm leading-7 text-white/65">{item.answer}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
