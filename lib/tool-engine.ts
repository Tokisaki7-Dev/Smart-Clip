import type { ToolSlug } from "@/types";

export type ToolCapability =
  | "autoTrim"
  | "multiClip"
  | "autoCaption"
  | "premiumWorker"
  | "verticalize"
  | "audioNormalize"
  | "highCompression"
  | "formatConvert"
  | "viralPacing"
  | "videoEnhance";

export interface ToolPresetBlueprint {
  label: string;
  durationSeconds: number | null;
  multiClipCount: number;
  targetAspect: "9:16" | "16:9" | "audio";
  strategy: string;
  headline: string;
}

export interface ToolEngineProfile {
  capabilities: ToolCapability[];
  workerEnabled: boolean;
  autoCaption: boolean;
  primaryGoal: string;
  highlights: string[];
  steps: string[];
  premiumStory: string;
  presetBlueprints: ToolPresetBlueprint[];
}

export interface SmartClipWindow {
  label: string;
  trimStart: number;
  trimEnd: number;
  headline: string;
}

export interface MediaAnalysis {
  orientation: "vertical" | "horizontal" | "square" | "audio";
  durationLabel: string;
  score: number;
  scoreLabel: string;
  strategy: string;
  summary: string;
  recommendations: string[];
  windows: SmartClipWindow[];
}

const defaultVideoPresets: ToolPresetBlueprint[] = [
  {
    label: "Original",
    durationSeconds: null,
    multiClipCount: 1,
    targetAspect: "16:9",
    strategy: "Mantem o enquadramento original com ajuste minimo.",
    headline: "Exportacao direta"
  },
  {
    label: "Reels 1080x1920",
    durationSeconds: 45,
    multiClipCount: 1,
    targetAspect: "9:16",
    strategy: "Verticaliza e deixa mais pronto para discovery.",
    headline: "Preset social vertical"
  },
  {
    label: "Shorts 1080x1920",
    durationSeconds: 45,
    multiClipCount: 1,
    targetAspect: "9:16",
    strategy: "Recorta para Shorts com area segura e ritmo melhor.",
    headline: "Preset Shorts"
  },
  {
    label: "TikTok 1080x1920",
    durationSeconds: 30,
    multiClipCount: 1,
    targetAspect: "9:16",
    strategy: "Mantem o clip curto e pronto para TikTok.",
    headline: "Preset TikTok"
  },
  {
    label: "Stories 1080x1920",
    durationSeconds: 20,
    multiClipCount: 1,
    targetAspect: "9:16",
    strategy: "Encurta e prepara para stories e anuncios curtos.",
    headline: "Preset Stories"
  },
  {
    label: "WhatsApp leve",
    durationSeconds: 20,
    multiClipCount: 1,
    targetAspect: "16:9",
    strategy: "Prioriza leveza e envio rapido.",
    headline: "Preset leve"
  }
];

const toolEngineProfiles: Record<string, ToolEngineProfile> = {
  "clip-trimmer": {
    capabilities: ["autoTrim"],
    workerEnabled: true,
    autoCaption: false,
    primaryGoal: "Cortar trechos específicos com alta velocidade (Stream Copy).",
    highlights: ["Corte sem perda de qualidade", "Velocidade instantânea", "Suporte a milissegundos"],
    steps: ["Upload", "Definir tempos", "Exportar"],
    premiumStory: "Edição rápida e precisa.",
    presetBlueprints: []
  },
  "auto-captions": {
    capabilities: ["autoCaption"],
    workerEnabled: true,
    autoCaption: true,
    primaryGoal: "Gerar legendas automáticas via IA (Whisper).",
    highlights: ["Transcrição precisa", "Opção de Hardcode", "Exportação SRT"],
    steps: ["Upload", "Transcrição IA", "Queimar Legenda"],
    premiumStory: "Aumente a retenção dos seus vídeos.",
    presetBlueprints: []
  },
  "video-compressor": {
    capabilities: ["highCompression"],
    workerEnabled: true,
    autoCaption: false,
    primaryGoal: "Reduzir tamanho do arquivo via CRF libx264.",
    highlights: ["WhatsApp Friendly", "High Quality", "Economia de espaço"],
    steps: ["Upload", "Escolher preset", "Comprimir"],
    premiumStory: "Compactação sem perda visível.",
    presetBlueprints: [
      {
        label: "WhatsApp Friendly",
        durationSeconds: null,
        multiClipCount: 1,
        targetAspect: "16:9",
        strategy: "CRF 28 para máxima leveza.",
        headline: "Envio Rápido"
      },
      {
        label: "High Quality",
        durationSeconds: null,
        multiClipCount: 1,
        targetAspect: "16:9",
        strategy: "CRF 18 para preservação de detalhes.",
        headline: "Qualidade Máxima"
      }
    ]
  },
  "format-converter": {
    capabilities: ["formatConvert"],
    workerEnabled: true,
    autoCaption: false,
    primaryGoal: "Converter vídeos entre MP4, MOV, WebM, AVI e MKV.",
    highlights: ["Suporte multiformato", "Preservação de Codec", "Rápido"],
    steps: ["Upload", "Escolher Formato", "Converter"],
    premiumStory: "Compatibilidade total.",
    presetBlueprints: []
  },
  "audio-extractor": {
    capabilities: ["audioNormalize"],
    workerEnabled: true,
    autoCaption: false,
    primaryGoal: "Extrair trilha sonora em MP3 ou WAV.",
    highlights: ["MP3 320kbps", "WAV Lossless", "Extração Rápida"],
    steps: ["Upload", "Escolher Formato", "Extrair"],
    premiumStory: "Transforme vídeo em áudio profissional.",
    presetBlueprints: []
  },
  "video-enhancer": {
    capabilities: ["videoEnhance"],
    workerEnabled: true,
    autoCaption: false,
    primaryGoal: "Melhorar nitidez e reduzir ruído digital.",
    highlights: ["Filtro Unsharp", "Denoise Hqdn3d", "Ajuste de Cor"],
    steps: ["Upload", "Aplicar Filtros", "Melhorar"],
    premiumStory: "Recupere a qualidade visual de seus vídeos.",
    presetBlueprints: [
      {
        label: "Smart Enhance",
        durationSeconds: null,
        multiClipCount: 1,
        targetAspect: "16:9",
        strategy: "Otimização de nitidez e redução de ruído.",
        headline: "Melhoria IA"
      }
    ]
  }
};

export function getToolEngineProfile(slug: ToolSlug) {
  return toolEngineProfiles[slug];
}

export function getPresetBlueprints(slug: ToolSlug) {
  return getToolEngineProfile(slug).presetBlueprints;
}

export function supportsToolCapability(slug: ToolSlug, capability: ToolCapability) {
  return getToolEngineProfile(slug).capabilities.includes(capability);
}

export function getDefaultPresetLabel(slug: ToolSlug) {
  return getPresetBlueprints(slug)[0]?.label || "Original";
}

function getOrientation(width: number, height: number): MediaAnalysis["orientation"] {
  if (!width || !height) {
    return "audio";
  }

  if (width === height) {
    return "square";
  }

  if (height > width) {
    return "vertical";
  }

  return "horizontal";
}

function formatDurationLabel(duration: number) {
  if (!duration || duration <= 0) {
    return "Duracao ainda nao detectada";
  }

  if (duration < 60) {
    return `${Math.round(duration)} segundos`;
  }

  const minutes = Math.floor(duration / 60);
  const seconds = Math.round(duration % 60);
  return seconds > 0 ? `${minutes} min ${seconds}s` : `${minutes} min`;
}

function getBaseWindow(duration: number, trimStart: number, trimEnd: number) {
  if (duration <= 0) {
    return { start: 0, end: 0 };
  }

  const start = Math.max(0, trimStart);
  const end = trimEnd > start ? Math.min(duration, trimEnd) : duration;

  return { start, end };
}

function createSequencedWindows(params: {
  count: number;
  clipDuration: number;
  baseStart: number;
  baseEnd: number;
  labels: string[];
}) {
  const { count, clipDuration, baseStart, baseEnd, labels } = params;
  const safeCount = Math.max(1, count);
  const usableEnd = Math.max(baseStart + clipDuration, baseEnd);
  const spacing =
    safeCount === 1
      ? 0
      : Math.max(clipDuration * 0.65, (usableEnd - baseStart - clipDuration) / (safeCount - 1));

  return Array.from({ length: safeCount }, (_, index) => {
    const rawStart = baseStart + spacing * index;
    const start = Number(
      Math.max(baseStart, Math.min(rawStart, usableEnd - clipDuration)).toFixed(2)
    );
    const end = Number(Math.min(usableEnd, start + clipDuration).toFixed(2));

    return {
      label: labels[index] || `Clip ${index + 1}`,
      trimStart: start,
      trimEnd: Math.max(start + 4, end),
      headline: labels[index] || `Clip ${index + 1}`
    };
  });
}

export function buildSmartWindows(params: {
  toolSlug: ToolSlug;
  preset: string;
  duration: number;
  trimStart: number;
  trimEnd: number;
}) {
  const { toolSlug, preset, duration, trimStart, trimEnd } = params;
  const blueprint =
    getPresetBlueprints(toolSlug).find((item) => item.label === preset) ||
    getPresetBlueprints(toolSlug)[0];
  const clipDuration = Math.max(8, blueprint?.durationSeconds || Math.min(45, duration || 45));
  const baseWindow = getBaseWindow(duration, trimStart, trimEnd);
  const baseStart = baseWindow.start;
  const baseEnd = baseWindow.end || Math.max(clipDuration, duration);

  if (toolSlug === "criar-trailer-curto") {
    return createSequencedWindows({
      count: 1,
      clipDuration,
      baseStart,
      baseEnd: Math.min(baseEnd, baseStart + clipDuration),
      labels: [blueprint?.headline || "Trailer curto"]
    });
  }

  if (toolSlug === "gerar-ganchos-de-video") {
    return createSequencedWindows({
      count: blueprint?.multiClipCount || 4,
      clipDuration,
      baseStart,
      baseEnd: Math.min(baseEnd, baseStart + clipDuration * 5),
      labels: ["Hook 1", "Hook 2", "Hook 3", "Hook 4"]
    });
  }

  if (
    toolSlug === "gerar-varios-clipes-automaticos" ||
    toolSlug === "podcast-para-clipes" ||
    toolSlug === "aula-para-clipes"
  ) {
    return createSequencedWindows({
      count: blueprint?.multiClipCount || 3,
      clipDuration,
      baseStart,
      baseEnd,
      labels:
        toolSlug === "podcast-para-clipes"
          ? ["Trecho forte", "Insight", "Fechamento"]
          : toolSlug === "aula-para-clipes"
            ? ["Conceito", "Exemplo", "Resumo"]
            : ["Clip 1", "Clip 2", "Clip 3"]
    });
  }

  return [
    {
      label: blueprint?.headline || "Resultado principal",
      trimStart: baseStart,
      trimEnd:
        clipDuration && baseEnd > baseStart
          ? Number(Math.min(baseEnd, baseStart + clipDuration).toFixed(2))
          : baseEnd,
      headline: blueprint?.strategy || "Resultado principal"
    }
  ];
}

export function analyzeMediaForTool(params: {
  toolSlug: ToolSlug;
  preset: string;
  duration: number;
  width: number;
  height: number;
  trimStart: number;
  trimEnd: number;
  fileSizeMb: number;
}) {
  const { toolSlug, preset, duration, width, height, trimStart, trimEnd, fileSizeMb } = params;
  const profile = getToolEngineProfile(toolSlug);
  const windows = buildSmartWindows({
    toolSlug,
    preset,
    duration,
    trimStart,
    trimEnd
  });
  const orientation = getOrientation(width, height);
  const targetIsVertical =
    getPresetBlueprints(toolSlug).find((item) => item.label === preset)?.targetAspect === "9:16";
  const durationScore =
    duration <= 0 ? 58 : duration >= 12 && duration <= 240 ? 92 : duration <= 600 ? 78 : 64;
  const orientationScore =
    orientation === "audio"
      ? 75
      : targetIsVertical && orientation === "vertical"
        ? 96
        : targetIsVertical
          ? 78
          : 88;
  const sizeScore = fileSizeMb <= 800 ? 92 : fileSizeMb <= 2500 ? 82 : 68;
  const score = Math.max(
    48,
    Math.min(99, Math.round(durationScore * 0.45 + orientationScore * 0.35 + sizeScore * 0.2))
  );
  const scoreLabel =
    score >= 90
      ? "Excelente para processar"
      : score >= 75
        ? "Bom encaixe"
        : "Vai funcionar melhor com ajuste";
  const recommendations: string[] = [];

  if (targetIsVertical && orientation === "horizontal") {
    recommendations.push(
      "O video e horizontal. O SmartClip vai verticalizar com blur ou crop para manter foco."
    );
  }

  if (duration > 300 && !supportsToolCapability(toolSlug, "multiClip")) {
    recommendations.push(
      "Video longo demais para uma unica saida curta. Vale testar a versao de varios clipes."
    );
  }

  if (supportsToolCapability(toolSlug, "multiClip")) {
    recommendations.push(
      `Este preset deve render ${windows.length} saida${windows.length > 1 ? "s" : ""} separada${windows.length > 1 ? "s" : ""}.`
    );
  }

  if (supportsToolCapability(toolSlug, "autoCaption")) {
    recommendations.push(
      "Legenda automatica pode sair embutida no video ou como arquivos SRT e VTT."
    );
  }

  if (supportsToolCapability(toolSlug, "premiumWorker")) {
    recommendations.push(
      "Quando o arquivo rende mais de um corte, vale testar varias saidas do mesmo preset."
    );
  }

  return {
    orientation,
    durationLabel: formatDurationLabel(duration),
    score,
    scoreLabel,
    strategy: profile.primaryGoal,
    summary: `${profile.primaryGoal} O preset atual trabalha em ${windows.length} saida${windows.length > 1 ? "s" : ""}.`,
    recommendations,
    windows
  } satisfies MediaAnalysis;
}
