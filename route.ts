import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { jobId, rating, tool } = await req.json();

  // Como solicitado "sem banco de dados", registramos no log do servidor.
  // Em um ambiente SaaS real, isso seria capturado por ferramentas de log (ex: Datadog, Axiom, CloudWatch).
  console.log(`[FEEDBACK] Job: ${jobId} | Rating: ${rating} | Tool: ${tool} | Time: ${new Date().toISOString()}`);

  return NextResponse.json({ success: true });
}