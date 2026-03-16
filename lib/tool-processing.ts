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

const defaultVideoPresetOptions = [
  "Original",
  "Reels 1080x1920",
  "Shorts 1080x1920",
  "TikTok 1080x1920",
  "Stories 1080x1920",
  "WhatsApp leve"
] as const;

const toolPresetMap: Partial<Record<ToolSlug, readonly string[]>> = {
  "video-para-clipe-com-legenda-automatica": [
    "Clip com legenda 30s",
    "Clip com legenda 45s",
    "Clip com legenda podcast 59s"
  ],
  "gerar-varios-clipes-automaticos": ["3 clipes 20s", "3 clipes 30s", "3 clipes 45s"],
  "podcast-para-clipes": ["Podcast 30s", "Podcast 45s", "Podcast 59s"],
  "video-para-anuncio-curto": ["Anuncio 15s", "Anuncio 20s", "Anuncio 30s"],
  "video-para-clipe-viral": [
    "Clip viral 30s",
    "Clip viral 45s",
    "UGC 20s",
    "Podcast 59s"
  ],
  "cortar-video-automaticamente": ["Auto corte 30s", "Auto corte 45s", "Auto corte 60s"],
  "video-horizontal-para-vertical": [
    "Vertical com blur",
    "Vertical com crop central",
    "Stories 1080x1920"
  ],
  "criar-trailer-curto": ["Trailer 15s", "Trailer 30s", "Teaser 45s"]
};

export function getPresetOptions(slug: ToolSlug) {
  return [...(toolPresetMap[slug] ?? defaultVideoPresetOptions)];
}

export function isAudioOnlyTool(slug: ToolSlug) {
  return slug === "extrair-audio" || slug === "mp4-para-mp3";
}

export function getDefaultPresetForTool(slug: ToolSlug) {
  switch (slug) {
    case "video-para-clipe-com-legenda-automatica":
      return "Clip com legenda 45s";
    case "gerar-varios-clipes-automaticos":
      return "3 clipes 30s";
    case "podcast-para-clipes":
      return "Podcast 45s";
    case "video-para-anuncio-curto":
      return "Anuncio 20s";
    case "video-para-clipe-viral":
      return "Clip viral 45s";
    case "cortar-video-automaticamente":
      return "Auto corte 45s";
    case "video-horizontal-para-vertical":
      return "Vertical com blur";
    case "criar-trailer-curto":
      return "Trailer 30s";
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

function getTargetDuration(preset: string) {
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
    "[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=18:8[bg]",
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
    return "eq=contrast=1.1:saturation=1.16:brightness=0.02,unsharp=5:5:0.82:3:3:0.3";
  }

  if (toolSlug === "podcast-para-clipes") {
    return "eq=contrast=1.06:saturation=1.12:brightness=0.015,unsharp=5:5:0.74:3:3:0.24";
  }

  if (toolSlug === "gerar-varios-clipes-automaticos") {
    return "eq=contrast=1.07:saturation=1.16:brightness=0.02,unsharp=5:5:0.72:3:3:0.26";
  }

  if (toolSlug === "video-para-clipe-com-legenda-automatica") {
    return "eq=contrast=1.08:saturation=1.2:brightness=0.02,unsharp=5:5:0.78:3:3:0.28";
  }

  if (toolSlug === "video-para-clipe-viral") {
    return "eq=contrast=1.07:saturation=1.18:brightness=0.02,unsharp=5:5:0.7:3:3:0.25";
  }

  if (toolSlug === "criar-trailer-curto") {
    return "eq=contrast=1.09:saturation=1.1:brightness=0.015,unsharp=5:5:0.75:3:3:0.3";
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

  if (toolSlug === "video-para-clipe-com-legenda-automatica") {
    if (preset === "Clip com legenda 30s") {
      return 1.03;
    }

    return 1.01;
  }

  if (toolSlug === "criar-trailer-curto") {
    return preset === "Trailer 15s" ? 1.07 : 1.04;
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
    preset === "Reels 1080x1920" ||
    preset === "Shorts 1080x1920" ||
    preset === "TikTok 1080x1920" ||
    preset === "Stories 1080x1920" ||
    preset === "Vertical com crop central" ||
    toolSlug === "video-para-clipe-com-legenda-automatica" ||
    toolSlug === "gerar-varios-clipes-automaticos" ||
    toolSlug === "podcast-para-clipes" ||
    toolSlug === "video-para-anuncio-curto" ||
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
    return qualityMode === "higher" ? "3400k" : qualityMode === "smaller" ? "2000k" : "2800k";
  }

  if (toolSlug === "podcast-para-clipes" || toolSlug === "gerar-varios-clipes-automaticos") {
    return qualityMode === "higher" ? "3300k" : qualityMode === "smaller" ? "1800k" : "2600k";
  }

  if (toolSlug === "video-para-clipe-com-legenda-automatica") {
    return qualityMode === "higher" ? "3600k" : qualityMode === "smaller" ? "2200k" : "3000k";
  }

  if (
    toolSlug === "comprimir-video" ||
    toolSlug === "video-para-whatsapp" ||
    preset === "WhatsApp leve"
  ) {
    return "900k";
  }

  if (toolSlug === "video-para-clipe-viral" || toolSlug === "video-horizontal-para-vertical") {
    return qualityMode === "higher" ? "3200k" : qualityMode === "smaller" ? "1600k" : "2400k";
  }

  if (toolSlug === "criar-trailer-curto") {
    return qualityMode === "higher" ? "3000k" : qualityMode === "smaller" ? "1500k" : "2200k";
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
    toolSlug === "video-para-clipe-com-legenda-automatica" ||
    toolSlug === "gerar-varios-clipes-automaticos" ||
    toolSlug === "podcast-para-clipes" ||
    toolSlug === "video-para-anuncio-curto" ||
    toolSlug === "video-para-clipe-viral" ||
    toolSlug === "video-horizontal-para-vertical" ||
    preset === "Vertical com blur"
  );
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
