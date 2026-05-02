import { spawn } from "child_process";
import path from "path";
import fs from "fs/promises";
import { createReadStream } from "fs";
import { v4 as uuidv4 } from "uuid";
import { buildProcessingPlan, type CaptionSegment, type OutputFormat, type QualityMode } from "@/lib/tool-processing";
import { videoQueue, REDIS_CONNECTION } from "@/lib/video-queue";
import { Worker, Job } from "bullmq";
import { getIO } from "@/lib/socket";
import type { ToolSlug } from "@/types"; // Assuming ToolSlug is defined here or needs to be imported

export interface JobStatus {
  id: string;
  progress: number;
  status: "pending" | "processing" | "completed" | "error";
  outputPath?: string;
  error?: string;
}

export class VideoService {
  public static TEMP_DIR = "/tmp/smartclip";
  private static MAX_FILE_SIZE_MB = 1000; // Example: 1GB limit for processing

  static async init() {
    try {
      await fs.access(this.TEMP_DIR);
    } catch (error) {
      await fs.mkdir(this.TEMP_DIR, { recursive: true });
    }
  }

  /**
   * Runs ffprobe to get media metadata and perform basic validation.
   * @param filePath Path to the media file.
   * @returns Media metadata including duration, width, height, and codec info.
   */
  private static async getMediaMetadata(filePath: string): Promise<{
    duration: number;
    width: number;
    height: number;
    codecType: string;
    isValid: boolean;
    error?: string;
  }> {
    return new Promise((resolve) => {
      const ffprobeProcess = spawn("ffprobe", [
        "-v", "error",
        "-select_streams", "v:0", // Select video stream 0
        "-show_entries", "stream=duration,width,height,codec_type",
        "-of", "json",
        filePath,
      ]);

      let rawData = "";
      ffprobeProcess.stdout.on("data", (data) => {
        rawData += data.toString();
      });

      ffprobeProcess.stderr.on("data", (data) => {
        console.error(`ffprobe stderr: ${data}`);
      });

      ffprobeProcess.on("close", (code) => {
        if (code === 0) {
          try {
            const metadata = JSON.parse(rawData);
            const videoStream = metadata.streams?.[0];

            if (videoStream && videoStream.codec_type === "video") {
              resolve({
                duration: parseFloat(videoStream.duration || "0"),
                width: parseInt(videoStream.width || "0"),
                height: parseInt(videoStream.height || "0"),
                codecType: videoStream.codec_type,
                isValid: true,
              });
            } else {
              // Try to get audio stream if no video stream
              const audioProbeProcess = spawn("ffprobe", [
                "-v", "error",
                "-select_streams", "a:0", // Select audio stream 0
                "-show_entries", "stream=duration,codec_type",
                "-of", "json",
                filePath,
              ]);
              let audioRawData = "";
              audioProbeProcess.stdout.on("data", (data) => {
                audioRawData += data.toString();
              });
              audioProbeProcess.on("close", (audioCode) => {
                if (audioCode === 0) {
                  const audioMetadata = JSON.parse(audioRawData);
                  const audioStream = audioMetadata.streams?.[0];
                  if (audioStream && audioStream.codec_type === "audio") {
                    resolve({
                      duration: parseFloat(audioStream.duration || "0"),
                      width: 0, // No width for audio
                      height: 0, // No height for audio
                      codecType: audioStream.codec_type,
                      isValid: true,
                    });
                  } else {
                    resolve({ duration: 0, width: 0, height: 0, codecType: "unknown", isValid: false, error: "No valid video or audio stream found." });
                  }
                } else {
                  resolve({ duration: 0, width: 0, height: 0, codecType: "unknown", isValid: false, error: "ffprobe failed to analyze audio stream." });
                }
              });
            }
          } catch (e) {
            resolve({ duration: 0, width: 0, height: 0, codecType: "unknown", isValid: false, error: "Failed to parse ffprobe output." });
          }
        } else {
          resolve({ duration: 0, width: 0, height: 0, codecType: "unknown", isValid: false, error: `ffprobe exited with code ${code}.` });
        }
      });
    });
  }
    
  /**
   * Extrai áudio e chama API do OpenAI Whisper para gerar arquivo SRT
   */
  private static async generateSrt(videoPath: string, jobId: string): Promise<string> {
    const srtPath = path.join(this.TEMP_DIR, `${jobId}.srt`);
    const audioPath = path.join(this.TEMP_DIR, `${jobId}.mp3`);
    
    // 1. Extrai apenas o áudio para reduzir o tamanho do upload para a OpenAI e acelerar
    await new Promise<void>((resolve, reject) => {
      const audioProcess = spawn("ffmpeg", ["-i", videoPath, "-vn", "-ab", "128k", "-ar", "44100", "-y", audioPath]);
      audioProcess.on("close", (code) => {
        if (code === 0) resolve();
        else reject(new Error(`Audio extraction failed with code ${code}`));
      });
      audioProcess.stderr.on("data", (data) => console.error(`Audio extraction stderr: ${data}`));
    });

    // 2. Envia para OpenAI Whisper
    // Nota: Certifique-se de ter OPENAI_API_KEY no seu .env
    const formData = new FormData();
    formData.append("file", createReadStream(audioPath) as any);
    formData.append("model", "whisper-1");
    formData.append("response_format", "srt");

    try { // Use fetch from global scope or import a polyfill if running in Node < 18
      const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: formData as any,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI Whisper API failed: ${response.status} - ${errorText}`);
      }

      const srtContent = await response.text(); // Await the text content
      await fs.writeFile(srtPath, srtContent); // Use async fs.writeFile
    } catch (error) {
      console.error("Erro na transcrição Whisper:", error);
      // Fallback para legenda vazia em caso de erro
      await fs.writeFile(srtPath, "1\n00:00:00,000 --> 00:00:05,000\n[Erro na transcrição]"); // Use async fs.writeFile
    } finally {
      if (await fs.access(audioPath).then(() => true).catch(() => false)) { // Check existence async
        await fs.unlink(audioPath); // Use async fs.unlink
      }
    }
    
    return srtPath;
  }

  static async runFfmpeg(
    jobId: string,
    inputPath: string,
    toolSlug: ToolSlug,
    outputFormat: OutputFormat,
    qualityMode: QualityMode,
    preset: string,
    trimStart: number,
    trimEnd: number,
    duration: number, // Pass duration for buildProcessingPlan
    burnedCaptions?: { captions: CaptionSegment[]; fontFileName: string; }
  ): Promise<void> {
    // Adiciona o trabalho à fila para processamento em background
    await videoQueue.add("process-video", {
      jobId,
      inputPath,
      toolSlug,
      outputFormat,
      qualityMode,
      preset,
      trimStart,
      trimEnd,
      duration,
      burnedCaptions
    }, {
      jobId, // Permite rastrear o job no Redis pelo jobId original
      removeOnComplete: false, 
      removeOnFail: false
    });
  }

  /**
   * Consulta o status do Job no BullMQ/Redis
   */
  static async getJobStatus(jobId: string): Promise<JobStatus | null> {
    const job = await Job.fromId(videoQueue, jobId);
    if (!job) return null;

    const state = await job.getState();
    const progress = job.progress as number;
    
    let status: JobStatus["status"] = "pending";
    if (state === "active") status = "processing";
    else if (state === "completed") status = "completed";
    else if (state === "failed") status = "error";

    return {
      id: jobId,
      progress: progress || 0,
      status,
      outputPath: job.returnvalue?.outputPath,
      error: job.failedReason
    };
  }

  /**
   * Método executado pelo Worker. Faz o trabalho pesado.
   */
  public static async executeProcessing(job: Job) {
    const { jobId, inputPath, toolSlug, outputFormat, qualityMode, preset, trimStart, trimEnd, duration, burnedCaptions } = job.data;

    let srtPath: string | undefined;
    if (toolSlug === "auto-captions" && burnedCaptions) {
      srtPath = await this.generateSrt(inputPath, jobId);
    }

    const processingPlan = buildProcessingPlan({
      ...job.data,
      inputFileName: "input.mp4",
      burnedCaptions: burnedCaptions ? { ...burnedCaptions, fontFileName: srtPath || burnedCaptions.fontFileName } : undefined,
    });

    const outputPath = path.join(this.TEMP_DIR, processingPlan.outputFileName);
    const ffmpegArgs = processingPlan.args;

    const inputFsNameIndex = ffmpegArgs.indexOf("input.mp4");
    if (inputFsNameIndex !== -1) ffmpegArgs[inputFsNameIndex] = inputPath;
    ffmpegArgs[ffmpegArgs.length - 1] = outputPath;

    return new Promise((resolve, reject) => {
      const process = spawn("ffmpeg", ffmpegArgs);
      process.stderr.on("data", (data) => {
        const message = data.toString();
        const timeMatch = message.match(/time=(\d{2}:\d{2}:\d{2}.\d{2})/);
        if (timeMatch && duration > 0) {
          const timeParts = timeMatch[1].split(":");
          const currentSeconds = parseInt(timeParts[0]) * 3600 + parseInt(timeParts[1]) * 60 + parseFloat(timeParts[2]);
          const progress = Math.min(99, Math.round((currentSeconds / duration) * 100));
          job.updateProgress(progress);
        }
      });

      process.on("close", async (code) => {
        // Limpeza
        if (await fs.access(inputPath).then(() => true).catch(() => false) && !inputPath.includes("_out.")) {
          await fs.unlink(inputPath);
        }
        if (srtPath && await fs.access(srtPath).then(() => true).catch(() => false)) {
          await fs.unlink(srtPath);
        }

        if (code === 0) resolve({ outputPath });
        else reject(new Error(`FFmpeg exit code ${code}`));
      });
    });
  }

  /**
   * Remove arquivos temporários com mais de 24 horas de idade.
   */
  public static async cleanupTempFiles() {
    try {
      const files = await fs.readdir(this.TEMP_DIR);
      const now = Date.now();
      const expirationTime = 24 * 60 * 60 * 1000; // 24 horas

      for (const file of files) {
        const filePath = path.join(this.TEMP_DIR, file);
        const stats = await fs.stat(filePath);

        if (now - stats.mtimeMs > expirationTime) {
          await fs.unlink(filePath);
          console.log(`[CLEANUP] Arquivo removido por expiração: ${file}`);
        }
      }
    } catch (error) {
      console.error("[CLEANUP] Erro ao limpar diretório temporário:", error);
    }
  }

  /**
   * Executa o modelo Real-ESRGAN para upscaling e remoção de ruído via IA
   */
  private static async runRealESRGAN(input: string, output: string) {
    return new Promise<void>((resolve, reject) => {
      // s: 2 (Escala 2x), n: realesrgan-x4plus (Modelo robusto)
      const process = spawn("realesrgan-ncnn-vulkan", ["-i", input, "-o", output, "-n", "realesrgan-x4plus", "-s", "2", "-f", "mp4"]);
      process.on("close", (code) => {
        if (code === 0) resolve();
        else reject(new Error(`Real-ESRGAN failed with code ${code}`));
      });
      process.stderr.on("data", (data) => console.error(`Real-ESRGAN stderr: ${data}`));
    });
  }
}

// Inicialização do Worker (Singleton no servidor)
// Importante: Em ambientes Serverless (Vercel), o Worker não deve ser iniciado aqui.
// Ele deve rodar em um processo separado (ex: Railway, Render ou Docker).
if (typeof window === "undefined" && process.env.ENABLE_VIDEO_WORKER === "true") {
  const worker = new Worker(
    "video-processing",
    async (job) => VideoService.executeProcessing(job),
    { 
      connection: REDIS_CONNECTION,
      concurrency: Number(process.env.VIDEO_CONCURRENCY) || 2 // Controla velocidade vs carga
    }
  );

  worker.on("progress", (job, progress) => {
    if (job.id) getIO()?.to(job.id).emit("job-progress", { jobId: job.id, progress });
  });

  worker.on("completed", (job, result) => {
    if (job.id) getIO()?.to(job.id).emit("job-completed", { jobId: job.id, result });
  });

  worker.on("failed", (job, err) => {
    if (job.id) getIO()?.to(job.id).emit("job-error", { jobId: job.id, error: err?.message });
  });

  // Agenda a limpeza para rodar a cada 1 hora
  setInterval(() => {
    VideoService.cleanupTempFiles().catch(console.error);
  }, 60 * 60 * 1000);

  // Executa uma limpeza inicial ao subir o servidor
  VideoService.cleanupTempFiles().catch(console.error);
}