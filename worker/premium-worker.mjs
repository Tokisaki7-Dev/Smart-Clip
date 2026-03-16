import { createClient } from "@supabase/supabase-js";
import { spawn } from "node:child_process";
import { copyFile, mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const workerName = "smartclip-premium-worker";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(__dirname, "..");
const fontSourcePath = path.resolve(
  __dirname,
  "../public/fonts/noto-sans-v27-latin-regular.ttf"
);

const toolDefaults = {
  "video-para-clipe-com-legenda-automatica": {
    targetDuration: 45,
    multiClipCount: 1,
    captionsRequested: true
  },
  "video-para-clipe-viral": {
    targetDuration: 45,
    multiClipCount: 1,
    captionsRequested: false
  },
  "gerar-varios-clipes-automaticos": {
    targetDuration: 30,
    multiClipCount: 3,
    captionsRequested: false
  },
  "podcast-para-clipes": {
    targetDuration: 45,
    multiClipCount: 3,
    captionsRequested: false
  },
  "video-para-anuncio-curto": {
    targetDuration: 20,
    multiClipCount: 1,
    captionsRequested: false
  },
  "gerar-ganchos-de-video": {
    targetDuration: 15,
    multiClipCount: 4,
    captionsRequested: false
  },
  "aula-para-clipes": {
    targetDuration: 45,
    multiClipCount: 3,
    captionsRequested: false
  },
  "depoimento-para-anuncio": {
    targetDuration: 20,
    multiClipCount: 1,
    captionsRequested: false
  }
};

function log(message) {
  process.stdout.write(`[${new Date().toISOString()}] ${message}\n`);
}

async function loadEnvFile(filePath) {
  try {
    const raw = await readFile(filePath, "utf8");

    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith("#")) {
        continue;
      }

      const separatorIndex = trimmed.indexOf("=");
      if (separatorIndex === -1) {
        continue;
      }

      const key = trimmed.slice(0, separatorIndex).trim();
      const value = trimmed.slice(separatorIndex + 1).trim().replace(/^["']|["']$/g, "");

      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    // Arquivo opcional.
  }
}

function requiredEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getTargetDuration(preset, fallback) {
  if (!preset) {
    return fallback;
  }

  const match = preset.match(/(\d+)\s*s/i);
  if (!match) {
    return fallback;
  }

  return Number(match[1]) || fallback;
}

function normalizeWhisperPath(value) {
  return value.replace(/\\/g, "/").replace(/:/g, "\\:");
}

function parseSilenceRanges(stderr) {
  const lines = stderr.split(/\r?\n/);
  const silences = [];
  let currentStart = null;

  for (const line of lines) {
    const startMatch = line.match(/silence_start:\s*([0-9.]+)/);
    if (startMatch) {
      currentStart = Number(startMatch[1]);
    }

    const endMatch = line.match(/silence_end:\s*([0-9.]+)/);
    if (endMatch && currentStart !== null) {
      silences.push({
        start: currentStart,
        end: Number(endMatch[1])
      });
      currentStart = null;
    }
  }

  return silences;
}

function mergeSpeechSegments(segments) {
  if (!segments.length) {
    return [];
  }

  const sorted = [...segments].sort((left, right) => left.start - right.start);
  const merged = [sorted[0]];

  for (const segment of sorted.slice(1)) {
    const current = merged[merged.length - 1];

    if (segment.start - current.end <= 0.55) {
      current.end = Math.max(current.end, segment.end);
      continue;
    }

    merged.push({ ...segment });
  }

  return merged.filter((segment) => segment.end - segment.start >= 0.8);
}

function buildSpeechSegments(duration, silences) {
  if (!silences.length) {
    return [{ start: 0, end: duration }];
  }

  const segments = [];
  let cursor = 0;

  for (const silence of silences) {
    if (silence.start > cursor + 0.4) {
      segments.push({
        start: cursor,
        end: silence.start
      });
    }

    cursor = Math.max(cursor, silence.end);
  }

  if (cursor < duration - 0.4) {
    segments.push({
      start: cursor,
      end: duration
    });
  }

  return mergeSpeechSegments(segments);
}

function overlapsExisting(existing, candidate, minGap) {
  return existing.some(
    (window) =>
      candidate.start < window.end - minGap && candidate.end > window.start + minGap
  );
}

function fallbackWindows(duration, targetDuration, count) {
  const safeTarget = Math.min(targetDuration, Math.max(6, duration));
  const maxStart = Math.max(0, duration - safeTarget);

  if (count === 1 || maxStart === 0) {
    return [
      {
        start: clamp(duration * 0.16, 0, maxStart),
        end: clamp(duration * 0.16, 0, maxStart) + safeTarget,
        reason: "fallback"
      }
    ];
  }

  const step = maxStart / Math.max(1, count);
  return Array.from({ length: count }, (_, index) => {
    const start = clamp(step * index, 0, maxStart);
    return {
      start,
      end: start + safeTarget,
      reason: "fallback"
    };
  });
}

function selectClipWindows({
  duration,
  speechSegments,
  targetDuration,
  count
}) {
  const safeTarget = Math.min(targetDuration, Math.max(6, duration));
  const candidates = speechSegments
    .map((segment) => {
      const length = segment.end - segment.start;
      const midpoint = (segment.start + segment.end) / 2;
      const start = clamp(midpoint - safeTarget * 0.48, 0, Math.max(0, duration - safeTarget));
      const centerBias = 1 - Math.abs(midpoint - duration / 2) / Math.max(duration / 2, 1);

      return {
        start,
        end: start + safeTarget,
        score: length * 2 + centerBias,
        reason: "speech"
      };
    })
    .sort((left, right) => right.score - left.score);

  const windows = [];

  for (const candidate of candidates) {
    if (windows.length >= count) {
      break;
    }

    if (overlapsExisting(windows, candidate, safeTarget * 0.38)) {
      continue;
    }

    windows.push(candidate);
  }

  if (windows.length >= count) {
    return windows
      .sort((left, right) => left.start - right.start)
      .map(({ start, end, reason }, index) => ({
        label: `Clip ${index + 1}`,
        start: Number(start.toFixed(2)),
        end: Number(end.toFixed(2)),
        reason
      }));
  }

  const fallbacks = fallbackWindows(duration, safeTarget, count);
  return [...windows, ...fallbacks]
    .slice(0, count)
    .sort((left, right) => left.start - right.start)
    .map((window, index) => ({
      label: `Clip ${index + 1}`,
      start: Number(window.start.toFixed(2)),
      end: Number(window.end.toFixed(2)),
      reason: window.reason
    }));
}

function buildSubtitlesFilter(subtitleFileName) {
  const escaped = subtitleFileName.replace(/\\/g, "/");
  const style = [
    "Alignment=2",
    "FontName=Noto Sans",
    "FontSize=16",
    "PrimaryColour=&H00FFFFFF",
    "OutlineColour=&H0008101A",
    "BackColour=&H6608101A",
    "BorderStyle=3",
    "Outline=1",
    "Shadow=0",
    "MarginV=88"
  ].join(",");

  return `subtitles=${escaped}:fontsdir=.:force_style='${style}'`;
}

function buildClipArgs({ inputFile, outputFile, clip, subtitleFileName, toolSlug }) {
  const enhancement =
    toolSlug === "video-para-anuncio-curto"
      ? "eq=contrast=1.1:saturation=1.16:brightness=0.02,unsharp=5:5:0.82:3:3:0.3"
      : toolSlug === "depoimento-para-anuncio"
        ? "eq=contrast=1.08:saturation=1.14:brightness=0.02,unsharp=5:5:0.76:3:3:0.26"
      : toolSlug === "podcast-para-clipes"
        ? "eq=contrast=1.06:saturation=1.12:brightness=0.015,unsharp=5:5:0.74:3:3:0.24"
        : toolSlug === "aula-para-clipes"
          ? "eq=contrast=1.05:saturation=1.1:brightness=0.015,unsharp=5:5:0.72:3:3:0.24"
        : "eq=contrast=1.08:saturation=1.18:brightness=0.02,unsharp=5:5:0.76:3:3:0.26";

  const videoGraph = subtitleFileName
    ? [
        "[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=18:8[bg]",
        "[0:v]scale=1080:1920:force_original_aspect_ratio=decrease[fg]",
        `[bg][fg]overlay=(W-w)/2:(H-h)/2,${enhancement}[stage]`,
        `[stage]${buildSubtitlesFilter(subtitleFileName)}[v]`
      ].join(";")
    : [
        "[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=18:8[bg]",
        "[0:v]scale=1080:1920:force_original_aspect_ratio=decrease[fg]",
        `[bg][fg]overlay=(W-w)/2:(H-h)/2,${enhancement}[v]`
      ].join(";");

  return [
    "-y",
    "-ss",
    clip.start.toFixed(2),
    "-to",
    clip.end.toFixed(2),
    "-i",
    inputFile,
    "-filter_complex",
    videoGraph,
    "-map",
    "[v]",
    "-map",
    "0:a?",
    "-r",
    "30",
    "-c:v",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    "-b:v",
    "3200k",
    "-c:a",
    "aac",
    "-b:a",
    "128k",
    "-af",
    "loudnorm=I=-16:LRA=11:TP=-1.5",
    "-movflags",
    "+faststart",
    outputFile
  ];
}

function runBinary(binary, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(binary, args, {
      cwd: options.cwd,
      env: {
        ...process.env,
        ...options.env
      }
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
        return;
      }

      reject(
        new Error(
          `${binary} exited with code ${code}.\n${stderr || stdout}`.trim()
        )
      );
    });
  });
}

async function probeVideo(filePath) {
  const { stdout } = await runBinary("ffprobe", [
    "-v",
    "error",
    "-show_entries",
    "format=duration:stream=width,height",
    "-of",
    "json",
    filePath
  ]);

  const parsed = JSON.parse(stdout);
  const videoStream = Array.isArray(parsed.streams)
    ? parsed.streams.find((stream) => stream.width && stream.height) || parsed.streams[0]
    : null;

  return {
    duration: Number(parsed.format?.duration || 0),
    width: Number(videoStream?.width || 0),
    height: Number(videoStream?.height || 0)
  };
}

async function detectSpeechSegments(filePath, duration) {
  try {
    const { stderr } = await runBinary("ffmpeg", [
      "-hide_banner",
      "-nostats",
      "-i",
      filePath,
      "-af",
      "silencedetect=noise=-32dB:d=0.35",
      "-f",
      "null",
      "-"
    ]);

    return buildSpeechSegments(duration, parseSilenceRanges(stderr));
  } catch {
    return [{ start: 0, end: duration }];
  }
}

async function generateCaptionFile({ inputFile, clip, outputFile }) {
  const modelPath = process.env.WHISPER_MODEL_PATH;

  if (!modelPath) {
    return null;
  }

  const whisperOptions = [
    `model=${normalizeWhisperPath(modelPath)}`,
    "language=auto",
    `format=srt`,
    `destination=${outputFile}`
  ];

  if (process.env.WHISPER_VAD_MODEL_PATH) {
    whisperOptions.push(
      `vad_model=${normalizeWhisperPath(process.env.WHISPER_VAD_MODEL_PATH)}`
    );
  }

  await runBinary("ffmpeg", [
    "-y",
    "-ss",
    clip.start.toFixed(2),
    "-to",
    clip.end.toFixed(2),
    "-i",
    inputFile,
    "-vn",
    "-af",
    `whisper=${whisperOptions.join(":")}`,
    "-f",
    "null",
    "-"
  ]);

  try {
    const info = await stat(outputFile);
    return info.size > 0 ? outputFile : null;
  } catch {
    return null;
  }
}

async function createExportRecord({
  admin,
  job,
  video,
  storagePath,
  outputFormat,
  resolution
}) {
  const { data, error } = await admin
    .from("exports")
    .insert({
      user_id: job.user_id,
      video_id: video.id,
      processing_job_id: job.id,
      tool_slug: job.input.toolSlug,
      output_format: outputFormat,
      resolution,
      watermark_enabled: false,
      storage_path: storagePath,
      status: "completed",
      expires_at: video.retention_ends_at
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(`Could not insert export record: ${error.message}`);
  }

  return data.id;
}

async function processJob(admin, job) {
  if (!job.video_id) {
    throw new Error("Job does not reference a source video.");
  }

  const { data: video, error: videoError } = await admin
    .from("videos")
    .select("id, storage_bucket, storage_path, original_name, retention_ends_at")
    .eq("id", job.video_id)
    .maybeSingle();

  if (videoError || !video) {
    throw new Error(videoError?.message || "Source video not found.");
  }

  const tempDir = await mkdtemp(path.join(tmpdir(), "smartclip-worker-"));
  const localInput = path.join(tempDir, "input.mp4");
  const localFont = path.join(tempDir, "NotoSans-Regular.ttf");

  try {
    const { data: sourceBlob, error: sourceError } = await admin.storage
      .from(video.storage_bucket)
      .download(video.storage_path);

    if (sourceError || !sourceBlob) {
      throw new Error(sourceError?.message || "Could not download source video.");
    }

    const sourceBuffer = Buffer.from(await sourceBlob.arrayBuffer());
    await writeFile(localInput, sourceBuffer);
    await copyFile(fontSourcePath, localFont);

    const metadata = await probeVideo(localInput);
    const speechSegments = await detectSpeechSegments(localInput, metadata.duration);
    const defaults = toolDefaults[job.input.toolSlug] || toolDefaults["video-para-clipe-viral"];
    const targetDuration = getTargetDuration(job.input.preset, defaults.targetDuration);
    const multiClipCount = Math.max(
      1,
      Math.min(Number(job.input.multiClipCount || defaults.multiClipCount || 1), 5)
    );
    const captionsRequested = Boolean(
      job.input.captionsRequested ?? defaults.captionsRequested
    );
    const clips = selectClipWindows({
      duration: metadata.duration,
      speechSegments,
      targetDuration,
      count: multiClipCount
    });

    const outputEntries = [];

    for (const [index, clip] of clips.entries()) {
      const localOutput = path.join(tempDir, `clip-${index + 1}.mp4`);
      const localSrt = path.join(tempDir, `clip-${index + 1}.srt`);
      const subtitleFile = captionsRequested
        ? await generateCaptionFile({
            inputFile: localInput,
            clip,
            outputFile: localSrt
          })
        : null;

      await runBinary(
        "ffmpeg",
        buildClipArgs({
          inputFile: "input.mp4",
          outputFile: `clip-${index + 1}.mp4`,
          clip,
          subtitleFileName: subtitleFile ? path.basename(subtitleFile) : null,
          toolSlug: job.input.toolSlug
        }),
        { cwd: tempDir }
      );

      const outputBuffer = await readFile(localOutput);
      const outputName = `${video.original_name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9._-]/g, "-")}-${job.input.toolSlug}-${index + 1}.mp4`;
      const outputPath = `${job.user_id}/exports/${Date.now()}-${outputName}`;

      const { error: uploadError } = await admin.storage
        .from(video.storage_bucket)
        .upload(outputPath, outputBuffer, {
          contentType: "video/mp4",
          upsert: true
        });

      if (uploadError) {
        throw new Error(`Could not upload clip output: ${uploadError.message}`);
      }

      const exportId = await createExportRecord({
        admin,
        job,
        video,
        storagePath: outputPath,
        outputFormat: "mp4",
        resolution: "1080p"
      });

      outputEntries.push({
        exportId,
        label: clip.label,
        storagePath: outputPath,
        resolution: "1080p",
        status: "completed",
        start: clip.start,
        end: clip.end,
        captions: Boolean(subtitleFile)
      });
    }

    await admin
      .from("processing_jobs")
      .update({
        status: "completed",
        finished_at: new Date().toISOString(),
        output: {
          clips: outputEntries,
          analysis: {
            duration: metadata.duration,
            speechSegments,
            worker: workerName
          }
        }
      })
      .eq("id", job.id);

    log(`Completed job ${job.id} with ${outputEntries.length} clip(s).`);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

async function failJob(admin, jobId, errorMessage) {
  await admin
    .from("processing_jobs")
    .update({
      status: "failed",
      finished_at: new Date().toISOString(),
      error_message: errorMessage.slice(0, 2000)
    })
    .eq("id", jobId);
}

async function claimNextJob(admin, workerToken) {
  const { data: candidates, error } = await admin
    .from("processing_jobs")
    .select("id, user_id, video_id, type, input, priority, created_at")
    .in("type", ["auto_clip", "auto_caption"])
    .eq("status", "queued")
    .order("priority", { ascending: false })
    .order("created_at", { ascending: true })
    .limit(10);

  if (error) {
    throw new Error(`Could not load queued jobs: ${error.message}`);
  }

  for (const candidate of (candidates || []).filter((item) => item.input?.mode === "premium")) {
    const { data: claimed, error: claimError } = await admin
      .from("processing_jobs")
      .update({
        status: "processing",
        worker_token: workerToken,
        started_at: new Date().toISOString()
      })
      .eq("id", candidate.id)
      .eq("status", "queued")
      .select("id, user_id, video_id, type, input, priority, created_at")
      .maybeSingle();

    if (claimError) {
      continue;
    }

    if (claimed) {
      return claimed;
    }
  }

  return null;
}

async function runWorker() {
  await loadEnvFile(path.join(workspaceRoot, ".env.local"));
  await loadEnvFile(path.join(workspaceRoot, ".env"));

  const supabaseUrl = requiredEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = requiredEnv("SUPABASE_SERVICE_ROLE_KEY");
  const workerToken = `${workerName}-${Math.random().toString(36).slice(2, 10)}`;
  const once = process.argv.includes("--once");
  const pollInterval = Number(process.env.SMARTCLIP_WORKER_POLL_MS || 12000);

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  log(`${workerName} started${once ? " in once mode" : ""}.`);

  while (true) {
    const job = await claimNextJob(admin, workerToken);

    if (!job) {
      if (once) {
        log("No queued premium jobs found.");
        return;
      }

      await sleep(pollInterval);
      continue;
    }

    try {
      log(`Claimed job ${job.id} for ${job.input.toolSlug}.`);
      await processJob(admin, job);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown premium worker error.";
      log(`Failed job ${job.id}: ${message}`);
      await failJob(admin, job.id, message);
    }

    if (once) {
      return;
    }
  }
}

runWorker().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exit(1);
});
