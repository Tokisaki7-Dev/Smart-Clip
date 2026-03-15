import type { ToolSlug } from "@/types";

export type OutputFormat = "mp4" | "mov" | "mp3" | "wav";
export type QualityMode = "smaller" | "balanced" | "higher";

export interface FormatOption {
  label: string;
  value: OutputFormat;
  mimeType: string;
}

export interface ProcessingPlan {
  args: string[];
  outputFileName: string;
  outputMimeType: string;
  outputLabel: string;
}

export const videoPresetOptions = [
  "Original",
  "Reels 1080x1920",
  "Shorts 1080x1920",
  "TikTok 1080x1920",
  "Stories 1080x1920",
  "WhatsApp leve"
] as const;

export function isAudioOnlyTool(slug: ToolSlug) {
  return slug === "extrair-audio" || slug === "mp4-para-mp3";
}

export function getDefaultPresetForTool(slug: ToolSlug) {
  switch (slug) {
    case "video-para-reels":
      return "Reels 1080x1920";
    case "video-para-shorts":
      return "Shorts 1080x1920";
    case "video-para-tiktok":
      return "TikTok 1080x1920";
    case "video-para-stories":
      return "Stories 1080x1920";
    case "video-para-whatsapp":
      return "WhatsApp leve";
    default:
      return "Original";
  }
}

export function getFormatOptions(slug: ToolSlug): FormatOption[] {
  if (slug === "extrair-audio" || slug === "mp4-para-mp3") {
    return [
      { label: "MP3", value: "mp3", mimeType: "audio/mpeg" },
      { label: "WAV", value: "wav", mimeType: "audio/wav" }
    ];
  }

  if (slug === "converter-video") {
    return [
      { label: "MP4", value: "mp4", mimeType: "video/mp4" },
      { label: "MOV", value: "mov", mimeType: "video/quicktime" }
    ];
  }

  if (slug === "mov-para-mp4") {
    return [{ label: "MP4", value: "mp4", mimeType: "video/mp4" }];
  }

  return [{ label: "MP4", value: "mp4", mimeType: "video/mp4" }];
}

export function getDefaultOutputFormat(slug: ToolSlug): OutputFormat {
  return getFormatOptions(slug)[0]?.value || "mp4";
}

function getVerticalFilter() {
  return "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:black";
}

function getPresetFilter(preset: string, slug: ToolSlug) {
  if (
    preset === "Reels 1080x1920" ||
    preset === "Shorts 1080x1920" ||
    preset === "TikTok 1080x1920" ||
    preset === "Stories 1080x1920" ||
    slug === "video-para-reels" ||
    slug === "video-para-shorts" ||
    slug === "video-para-tiktok" ||
    slug === "video-para-stories"
  ) {
    return getVerticalFilter();
  }

  if (preset === "WhatsApp leve" || slug === "video-para-whatsapp") {
    return "scale='if(gt(iw,960),960,iw)':-2:force_original_aspect_ratio=decrease";
  }

  return "";
}

function getVideoBitrate(slug: ToolSlug, qualityMode: QualityMode, preset: string) {
  if (slug === "comprimir-video" || slug === "video-para-whatsapp" || preset === "WhatsApp leve") {
    return "900k";
  }

  if (qualityMode === "smaller") {
    return "1200k";
  }

  if (qualityMode === "higher") {
    return "2600k";
  }

  return "1800k";
}

function getAudioBitrate(preset: string) {
  return preset === "WhatsApp leve" ? "96k" : "128k";
}

function getTrimArgs(trimStart: number, trimEnd: number) {
  if (trimEnd <= trimStart) {
    return [];
  }

  return ["-ss", trimStart.toFixed(2), "-to", trimEnd.toFixed(2)];
}

export function buildProcessingPlan(params: {
  toolSlug: ToolSlug;
  inputFileName: string;
  outputFormat: OutputFormat;
  qualityMode: QualityMode;
  preset: string;
  trimStart: number;
  trimEnd: number;
}): ProcessingPlan {
  const { inputFileName, outputFormat, preset, qualityMode, toolSlug, trimStart, trimEnd } =
    params;
  const trimArgs = getTrimArgs(trimStart, trimEnd);
  const inputExtension = inputFileName.split(".").pop()?.toLowerCase() || "mp4";
  const inputFsName = `input.${inputExtension}`;
  const baseName = inputFileName.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9._-]/g, "-");
  const outputFileName = `${baseName}-${toolSlug}.${outputFormat}`;

  if (isAudioOnlyTool(toolSlug)) {
    const args =
      outputFormat === "wav"
        ? [...trimArgs, "-i", inputFsName, "-vn", outputFileName]
        : [...trimArgs, "-i", inputFsName, "-vn", "-b:a", "192k", outputFileName];

    return {
      args,
      outputFileName,
      outputMimeType: outputFormat === "wav" ? "audio/wav" : "audio/mpeg",
      outputLabel: outputFormat.toUpperCase()
    };
  }

  if (toolSlug === "cortar-video" && preset === "Original" && outputFormat === "mp4") {
    return {
      args: [...trimArgs, "-i", inputFsName, "-c", "copy", outputFileName],
      outputFileName,
      outputMimeType: "video/mp4",
      outputLabel: "Corte rapido MP4"
    };
  }

  const filter = getPresetFilter(preset, toolSlug);
  const args = [...trimArgs, "-i", inputFsName];

  if (filter) {
    args.push("-vf", filter);
  }

  args.push("-r", "30");
  args.push("-c:v", "libx264");
  args.push("-pix_fmt", "yuv420p");
  args.push("-b:v", getVideoBitrate(toolSlug, qualityMode, preset));
  args.push("-c:a", "aac");
  args.push("-b:a", getAudioBitrate(preset));
  args.push("-movflags", "+faststart");

  if (outputFormat === "mov") {
    args.push("-f", "mov");
  }

  args.push(outputFileName);

  return {
    args,
    outputFileName,
    outputMimeType: outputFormat === "mov" ? "video/quicktime" : "video/mp4",
    outputLabel: outputFormat.toUpperCase()
  };
}
