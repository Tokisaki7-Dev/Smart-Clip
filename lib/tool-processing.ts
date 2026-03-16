import { getDefaultPresetLabel, getPresetBlueprints } from "@/lib/tool-engine";
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

export interface CaptionSegment {
  start: number;
  end: number;
  text: string;
}

export interface ResolvedTrimWindow {
  trimStart: number;
  trimEnd: number;
}

export function getPresetOptions(slug: ToolSlug) {
  return getPresetBlueprints(slug).map((item) => item.label);
}

export function isAudioOnlyTool(slug: ToolSlug) {
  return slug === "extrair-audio" || slug === "mp4-para-mp3";
}

export function getDefaultPresetForTool(slug: ToolSlug) {
  return getDefaultPresetLabel(slug);
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

function getTargetDuration(preset: string) {
  if (preset.includes("12s")) {
    return 12;
  }

  if (preset.includes("15s")) {
    return 15;
  }

  if (preset.includes("20s")) {
    return 20;
  }

  if (preset.includes("30s")) {
    return 30;
  }

  if (preset.includes("45s")) {
    return 45;
  }

  if (preset.includes("59s")) {
    return 59;
  }

  if (preset.includes("60s")) {
    return 60;
  }

  return null;
}

function getTrimArgs(trimStart: number, trimEnd: number) {
  if (trimEnd <= trimStart || trimEnd <= 0) {
    return [];
  }

  return ["-ss", trimStart.toFixed(2), "-to", trimEnd.toFixed(2)];
}

function hasManualTrim(trimStart: number, trimEnd: number, duration: number) {
  if (duration <= 0) {
    return trimStart > 0 || trimEnd > 0;
  }

  return trimStart > 0.1 || (trimEnd > 0 && trimEnd < duration - 0.1);
}

function resolveTrimWindow(params: {
  toolSlug: ToolSlug;
  preset: string;
  trimStart: number;
  trimEnd: number;
  duration: number;
}): ResolvedTrimWindow {
  const { toolSlug, preset, trimStart, trimEnd, duration } = params;

  if (duration <= 0 || hasManualTrim(trimStart, trimEnd, duration)) {
    return {
      trimStart,
      trimEnd
    };
  }

  const targetDuration = getTargetDuration(preset);
  if (!targetDuration) {
    return {
      trimStart,
      trimEnd
    };
  }

  const safeTarget = Math.min(targetDuration, Math.max(6, duration));
  let start = 0;

  switch (toolSlug) {
    case "video-para-clipe-com-legenda-automatica":
      start =
        duration > safeTarget + 10
          ? Math.min(Math.max(duration * 0.16, 1.25), duration - safeTarget - 1)
          : 0;
      break;
    case "gerar-varios-clipes-automaticos":
      start =
        duration > safeTarget + 12
          ? Math.min(Math.max(duration * 0.14, 1.2), duration - safeTarget - 1)
          : 0;
      break;
    case "podcast-para-clipes":
      start =
        duration > safeTarget + 10
          ? Math.min(Math.max(duration * 0.18, 1.5), duration - safeTarget - 1)
          : 0;
      break;
    case "video-para-anuncio-curto":
      start =
        duration > safeTarget + 8
          ? Math.min(Math.max(duration * 0.1, 0.8), duration - safeTarget - 1)
          : 0;
      break;
    case "video-para-clipe-viral":
      start =
        duration > safeTarget + 8
          ? Math.min(Math.max(duration * 0.18, 1.5), duration - safeTarget - 1)
          : 0;
      break;
    case "cortar-video-automaticamente":
      start =
        duration > safeTarget + 6
          ? Math.min(Math.max(duration * 0.12, 1), duration - safeTarget - 1)
          : 0;
      break;
    case "criar-trailer-curto":
      start =
        duration > safeTarget + 10
          ? Math.min(Math.max(duration * 0.08, 0), duration - safeTarget - 1)
          : 0;
      break;
    case "gerar-ganchos-de-video":
      start =
        duration > safeTarget + 10
          ? Math.min(Math.max(duration * 0.04, 0), duration - safeTarget - 1)
          : 0;
      break;
    case "aula-para-clipes":
      start =
        duration > safeTarget + 12
          ? Math.min(Math.max(duration * 0.12, 1.1), duration - safeTarget - 1)
          : 0;
      break;
    case "depoimento-para-anuncio":
      start =
        duration > safeTarget + 8
          ? Math.min(Math.max(duration * 0.06, 0.6), duration - safeTarget - 1)
          : 0;
      break;
    case "video-para-status-de-whatsapp":
      start =
        duration > safeTarget + 8
          ? Math.min(Math.max(duration * 0.08, 0.8), duration - safeTarget - 1)
          : 0;
      break;
    default:
      return {
        trimStart,
        trimEnd
      };
  }

  return {
    trimStart: Number(start.toFixed(2)),
    trimEnd: Number(Math.min(duration, start + safeTarget).toFixed(2))
  };
}

export function resolveOutputWindow(params: {
  toolSlug: ToolSlug;
  preset: string;
  trimStart: number;
  trimEnd: number;
  duration: number;
}) {
  return resolveTrimWindow(params);
}

function getVerticalPadFilter() {
  return "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:0x090b12";
}

function getVerticalBlurComplex(enhancement = "", captionFilter?: string) {
  const postOverlayChain = [enhancement || null, captionFilter || null]
    .filter(Boolean)
    .join(",");

  const outputLabel = postOverlayChain ? "[stage]" : "[v]";
  const graph = [
    "[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=8:2[bg]",
    "[0:v]scale=1080:1920:force_original_aspect_ratio=decrease[fg]",
    `[bg][fg]overlay=(W-w)/2:(H-h)/2${outputLabel}`
  ];

  if (postOverlayChain) {
    graph.push(`${outputLabel}${postOverlayChain}[v]`);
  }

  return graph.join(";");
}

function getVisualEnhancement(preset: string, toolSlug: ToolSlug) {
  if (toolSlug === "video-para-anuncio-curto") {
    return "eq=contrast=1.08:saturation=1.14:brightness=0.02";
  }

  if (toolSlug === "depoimento-para-anuncio") {
    return "eq=contrast=1.07:saturation=1.12:brightness=0.02";
  }

  if (toolSlug === "podcast-para-clipes") {
    return "eq=contrast=1.05:saturation=1.1:brightness=0.015";
  }

  if (toolSlug === "aula-para-clipes") {
    return "eq=contrast=1.04:saturation=1.08:brightness=0.015";
  }

  if (toolSlug === "gerar-varios-clipes-automaticos") {
    return "eq=contrast=1.06:saturation=1.14:brightness=0.02";
  }

  if (toolSlug === "gerar-ganchos-de-video") {
    return "eq=contrast=1.08:saturation=1.16:brightness=0.02";
  }

  if (toolSlug === "video-para-clipe-com-legenda-automatica") {
    return "eq=contrast=1.07:saturation=1.16:brightness=0.02";
  }

  if (toolSlug === "video-para-clipe-viral") {
    return "eq=contrast=1.06:saturation=1.14:brightness=0.02";
  }

  if (toolSlug === "criar-trailer-curto") {
    return "eq=contrast=1.07:saturation=1.08:brightness=0.015";
  }

  if (toolSlug === "video-para-status-de-whatsapp") {
    return "eq=contrast=1.02:saturation=1.03";
  }

  if (toolSlug === "video-horizontal-para-vertical" || preset.includes("1080x1920")) {
    return "eq=contrast=1.04:saturation=1.08:brightness=0.01";
  }

  if (preset === "WhatsApp leve" || toolSlug === "video-para-whatsapp") {
    return "eq=contrast=1.01:saturation=1.02";
  }

  return "eq=contrast=1.03:saturation=1.05";
}

function getPlaybackSpeed(preset: string, toolSlug: ToolSlug) {
  if (toolSlug === "video-para-anuncio-curto") {
    return preset === "Anuncio 15s" ? 1.08 : preset === "Anuncio 20s" ? 1.05 : 1.03;
  }

  if (toolSlug === "depoimento-para-anuncio") {
    return preset === "Depoimento 15s" ? 1.05 : preset === "Depoimento 20s" ? 1.03 : 1.01;
  }

  if (toolSlug === "video-para-clipe-com-legenda-automatica") {
    if (preset === "Clip com legenda 30s") {
      return 1.03;
    }

    return 1.01;
  }

  if (toolSlug === "criar-trailer-curto") {
    return preset === "Trailer 15s" ? 1.07 : 1.04;
  }

  if (toolSlug === "gerar-ganchos-de-video") {
    return preset === "4 ganchos 12s" ? 1.08 : preset === "4 ganchos 15s" ? 1.05 : 1.03;
  }

  return 1;
}

function getSimpleVideoFilter(params: {
  toolSlug: ToolSlug;
  preset: string;
  qualityMode: QualityMode;
}) {
  const { toolSlug, preset } = params;
  const filters: string[] = [];

  if (
    preset === "Clip com legenda 30s" ||
    preset === "Clip com legenda 45s" ||
    preset === "Clip com legenda podcast 59s" ||
    preset === "3 clipes 20s" ||
    preset === "3 clipes 30s" ||
    preset === "3 clipes 45s" ||
    preset === "Podcast 30s" ||
    preset === "Podcast 45s" ||
    preset === "Podcast 59s" ||
    preset === "Anuncio 15s" ||
    preset === "Anuncio 20s" ||
    preset === "Anuncio 30s" ||
    preset === "4 ganchos 12s" ||
    preset === "4 ganchos 15s" ||
    preset === "4 ganchos 20s" ||
    preset === "Aula 30s" ||
    preset === "Aula 45s" ||
    preset === "Aula 60s" ||
    preset === "Depoimento 15s" ||
    preset === "Depoimento 20s" ||
    preset === "Depoimento 30s" ||
    preset === "Status 15s" ||
    preset === "Status 30s" ||
    preset === "Reels 1080x1920" ||
    preset === "Shorts 1080x1920" ||
    preset === "TikTok 1080x1920" ||
    preset === "Stories 1080x1920" ||
    preset === "Vertical com crop central" ||
    toolSlug === "video-para-clipe-com-legenda-automatica" ||
    toolSlug === "gerar-varios-clipes-automaticos" ||
    toolSlug === "podcast-para-clipes" ||
    toolSlug === "video-para-anuncio-curto" ||
    toolSlug === "gerar-ganchos-de-video" ||
    toolSlug === "aula-para-clipes" ||
    toolSlug === "depoimento-para-anuncio" ||
    toolSlug === "video-para-status-de-whatsapp" ||
    toolSlug === "video-para-reels" ||
    toolSlug === "video-para-shorts" ||
    toolSlug === "video-para-tiktok" ||
    toolSlug === "video-para-stories"
  ) {
    filters.push(getVerticalPadFilter());
  }

  if (preset === "WhatsApp leve" || toolSlug === "video-para-whatsapp") {
    filters.push("scale='if(gt(iw,960),960,iw)':-2:force_original_aspect_ratio=decrease");
  }

  if (toolSlug === "cortar-video-automaticamente") {
    filters.push("fps=30");
  }

  const speed = getPlaybackSpeed(preset, toolSlug);
  if (speed !== 1) {
    filters.push(`setpts=PTS/${speed.toFixed(2)}`);
  }

  filters.push(getVisualEnhancement(preset, toolSlug));

  return filters.join(",");
}

function getVideoBitrate(toolSlug: ToolSlug, qualityMode: QualityMode, preset: string) {
  if (toolSlug === "video-para-anuncio-curto") {
    return qualityMode === "higher" ? "3000k" : qualityMode === "smaller" ? "1700k" : "2300k";
  }

  if (toolSlug === "depoimento-para-anuncio") {
    return qualityMode === "higher" ? "2800k" : qualityMode === "smaller" ? "1600k" : "2200k";
  }

  if (
    toolSlug === "podcast-para-clipes" ||
    toolSlug === "gerar-varios-clipes-automaticos" ||
    toolSlug === "aula-para-clipes" ||
    toolSlug === "gerar-ganchos-de-video"
  ) {
    return qualityMode === "higher" ? "2900k" : qualityMode === "smaller" ? "1500k" : "2100k";
  }

  if (toolSlug === "video-para-clipe-com-legenda-automatica") {
    return qualityMode === "higher" ? "3200k" : qualityMode === "smaller" ? "1800k" : "2400k";
  }

  if (
    toolSlug === "comprimir-video" ||
    toolSlug === "video-para-whatsapp" ||
    toolSlug === "video-para-status-de-whatsapp" ||
    preset === "WhatsApp leve"
  ) {
    return "900k";
  }

  if (toolSlug === "video-para-clipe-viral" || toolSlug === "video-horizontal-para-vertical") {
    return qualityMode === "higher" ? "2800k" : qualityMode === "smaller" ? "1500k" : "2100k";
  }

  if (toolSlug === "criar-trailer-curto") {
    return qualityMode === "higher" ? "2600k" : qualityMode === "smaller" ? "1400k" : "1900k";
  }

  if (qualityMode === "smaller") {
    return "1200k";
  }

  if (qualityMode === "higher") {
    return "2600k";
  }

  return "1800k";
}

function getAudioFilter(preset: string, toolSlug: ToolSlug) {
  const speed = getPlaybackSpeed(preset, toolSlug);
  const filters = ["loudnorm=I=-16:LRA=11:TP=-1.5"];

  if (speed !== 1) {
    filters.push(`atempo=${speed.toFixed(2)}`);
  }

  return filters.join(",");
}

function shouldUseVerticalComplex(toolSlug: ToolSlug, preset: string) {
  return (
    toolSlug === "video-horizontal-para-vertical" ||
    preset === "Vertical com blur"
  );
}

function getEncodingPreset(qualityMode: QualityMode) {
  return qualityMode === "higher" ? "veryfast" : "ultrafast";
}

function escapeDrawtextText(text: string) {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/:/g, "\\:")
    .replace(/'/g, "\\'")
    .replace(/%/g, "\\%")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

function buildCaptionDrawtextFilter(
  captions: CaptionSegment[],
  fontFileName: string
) {
  return captions
    .map((caption) => {
      const safeStart = Math.max(0, caption.start);
      const safeEnd = Math.max(safeStart + 0.2, caption.end);
      const escapedText = escapeDrawtextText(caption.text);

      return [
        "drawtext",
        `fontfile=${fontFileName}`,
        `text='${escapedText}'`,
        "fontcolor=white",
        "fontsize=46",
        "line_spacing=10",
        "borderw=4",
        "bordercolor=0x08101A@0.95",
        "box=1",
        "boxcolor=0x08101A@0.40",
        "boxborderw=18",
        "x=(w-text_w)/2",
        "y=h-(text_h*2.7)",
        `enable='between(t,${safeStart.toFixed(2)},${safeEnd.toFixed(2)})'`
      ].join(":");
    })
    .join(",");
}

export function buildProcessingPlan(params: {
  toolSlug: ToolSlug;
  inputFileName: string;
  outputFormat: OutputFormat;
  qualityMode: QualityMode;
  preset: string;
  trimStart: number;
  trimEnd: number;
  duration?: number;
  outputSuffix?: string;
  burnedCaptions?: {
    captions: CaptionSegment[];
    fontFileName: string;
  };
}): ProcessingPlan {
  const {
    inputFileName,
    outputFormat,
    preset,
    qualityMode,
    toolSlug,
    trimStart,
    trimEnd,
    duration = 0,
    outputSuffix,
    burnedCaptions
  } = params;
  const resolvedTrim = resolveTrimWindow({
    toolSlug,
    preset,
    trimStart,
    trimEnd,
    duration
  });
  const trimArgs = getTrimArgs(resolvedTrim.trimStart, resolvedTrim.trimEnd);
  const inputExtension = inputFileName.split(".").pop()?.toLowerCase() || "mp4";
  const inputFsName = `input.${inputExtension}`;
  const baseName = inputFileName.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9._-]/g, "-");
  const suffixSegment = outputSuffix ? `-${outputSuffix}` : "";
  const outputFileName = `${baseName}-${toolSlug}${suffixSegment}.${outputFormat}`;

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

  if (
    toolSlug === "cortar-video" &&
    preset === "Original" &&
    outputFormat === "mp4" &&
    !duration
  ) {
    return {
      args: [...trimArgs, "-i", inputFsName, "-c", "copy", outputFileName],
      outputFileName,
      outputMimeType: "video/mp4",
      outputLabel: "Corte rapido MP4"
    };
  }

  const args = [...trimArgs, "-i", inputFsName];
  const captionFilter =
    burnedCaptions && burnedCaptions.captions.length > 0
      ? buildCaptionDrawtextFilter(
          burnedCaptions.captions,
          burnedCaptions.fontFileName
        )
      : "";

  if (shouldUseVerticalComplex(toolSlug, preset)) {
    args.push(
      "-filter_complex",
      getVerticalBlurComplex(getVisualEnhancement(preset, toolSlug), captionFilter),
      "-map",
      "[v]",
      "-map",
      "0:a?"
    );
  } else {
    const videoFilter = getSimpleVideoFilter({
      toolSlug,
      preset,
      qualityMode
    });

    const combinedFilter = [videoFilter, captionFilter].filter(Boolean).join(",");

    if (combinedFilter) {
      args.push("-vf", combinedFilter);
    }
  }

  args.push("-r", "30");
  args.push("-c:v", "libx264");
  args.push("-preset", getEncodingPreset(qualityMode));
  args.push("-pix_fmt", "yuv420p");
  args.push("-b:v", getVideoBitrate(toolSlug, qualityMode, preset));
  args.push("-c:a", "aac");
  args.push("-b:a", preset === "WhatsApp leve" ? "96k" : "128k");
  args.push("-af", getAudioFilter(preset, toolSlug));
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
