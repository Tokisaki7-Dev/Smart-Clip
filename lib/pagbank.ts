import { z } from "zod";

const paymentPayloadSchema = z.object({
  planId: z.string(),
  customerEmail: z.string().email().optional(),
  paymentMethod: z.enum(["credit_card", "pix", "boleto", "debit_online"]),
  trialDays: z.number().nonnegative().optional(),
  creditPackId: z.string().optional()
});

export type PagBankCheckoutPayload = z.infer<typeof paymentPayloadSchema>;

export function parseCheckoutPayload(payload: unknown) {
  return paymentPayloadSchema.parse(payload);
}

export function createPagBankCheckoutSession(payload: PagBankCheckoutPayload) {
  return {
    provider: "pagbank",
    environment: process.env.PAGBANK_API_URL || "https://sandbox.api.pagseguro.com",
    status: "pending_configuration",
    message:
      "Conecte as credenciais reais do PagBank para emitir sessoes de checkout transparente.",
    payload
  };
}

export function verifyPagBankWebhook(token?: string | null) {
  return token && token === process.env.PAGBANK_WEBHOOK_TOKEN;
}
