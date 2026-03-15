import { faqItems } from "@/services/plans";

import { SectionHeading } from "@/components/layout/section-heading";
import { Card, CardContent } from "@/components/ui/card";

export function FaqSection() {
  return (
    <section className="container py-16">
      <SectionHeading
        eyebrow="FAQ"
        title="Perguntas que ajudam a vender sem esconder informacao"
        description="Clareza reduz friccao. E no SmartClip a clareza tambem melhora retencao porque o usuario entende o que ganhou, o que ainda pode testar e quando vale assinar."
      />

      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        {faqItems.map((item) => (
          <Card className="border-white/8 bg-white/[0.03]" key={item.question}>
            <CardContent className="space-y-3 p-6">
              <h3 className="font-display text-xl text-white">{item.question}</h3>
              <p className="text-sm leading-7 text-muted-foreground">{item.answer}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
