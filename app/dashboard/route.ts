import { NextRequest, NextResponse } from "next/server";
21import { VideoService } from "@/lib/video-service";
import fs from "fs";
import path from "path";

export async function GET(req: NextRequest, { params }: { params: { jobId: string } }) {
  const { searchParams } = new URL(req.url);
  const requestedFormat = searchParams.get("format");
  const job = await VideoService.getJobStatus(params.jobId);
  const TEMP_DIR = VideoService.TEMP_DIR;

  let filePath = job?.outputPath;

  // Se o usuário pediu o SRT especificamente
  if (requestedFormat === "srt") {
    filePath = path.join(TEMP_DIR, `${params.jobId}.srt`);
  }

  if (!filePath || !fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Arquivo não encontrado ou expirado" }, { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);
  const fileName = path.basename(filePath);

  // Define headers para download
  const response = new NextResponse(fileBuffer);
  response.headers.set("Content-Type", "application/octet-stream");
  response.headers.set("Content-Disposition", `attachment; filename="${fileName}"`);

  // Opcional: Deletar arquivo após download para economizar espaço
  // No SaaS real, você pode querer manter por 24h conforme as diretrizes
  // fs.unlinkSync(job.outputPath); 
  // videoJobs.delete(params.jobId);

  return response;
}