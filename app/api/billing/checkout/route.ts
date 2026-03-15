import { NextResponse } from "next/server";

import {
  createPagBankCheckoutSession,
  parseCheckoutPayload
} from "@/lib/pagbank";

export async function POST(request: Request) {
  const body = await request.json();
  const payload = parseCheckoutPayload(body);
  const session = createPagBankCheckoutSession(payload);

  return NextResponse.json({
    ok: true,
    session
  });
}
