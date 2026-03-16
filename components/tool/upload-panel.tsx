"use client";

import { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { Download, LoaderCircle, Scissors, Upload, WandSparkles } from "lucide-react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

import { useUploadEstimate } from "@/hooks/use-upload-estimate";
import {
  buildCaptionSrt,
  buildCaptionVtt,
  generateAutomaticCaptions
} from "@/lib/auto-captions";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  buildProcessingPlan,
  getDefaultOutputFormat,
  getDefaultPresetForTool,
  getFormatOptions,
  getPresetOptions,
  isAudioOnlyTool,
  resolveOutputWindow,
  type OutputFormat,
  type QualityMode
} from "@/lib/tool-processing";
import { type ToolDefinition, type ToolSlug } from "@/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

interface UploadPanelProps {
  tool: ToolDefinition;
}

interface ApiResult<T> {
  ok: boolean;
  status: number;
  data: T;
}

interface SignedUploadPayload {
  bucket: string;
  upload: {
    path: string;
    token: string;
  };
}

interface UploadPrepareResponse extends SignedUploadPayload {
  ok: boolean;
  video: {
    id: string;
  };
  error?: string;
}

interface JobCreateResponse {
  ok: boolean;
  job?: {
    id: string;
  };
  error?: string;
}

interface ExportPrepareResponse extends SignedUploadPayload {
  ok: boolean;
  export: {
    id: string;
  };
  error?: string;
}

interface ErrorPayload {
  error?: string;
  ok?: boolean;
}

function getApiError(data: unknown, fallbackMessage: string) {
  if (
    data &&
    typeof data === "object" &&
    "error" in data &&
    typeof data.error === "string"
  ) {
    return data.error;
  }

  return fallbackMessage;
}

function createProjectName(fileName: string, preset: string) {
  const baseName = fileName.replace(/\.[^.]+$/, "");
  return `${baseName} · ${preset}`;
}

function getResolutionLabel(toolSlug: ToolSlug, preset: string, outputFormat: OutputFormat) {
  if (isAudioOnlyTool(toolSlug) || outputFormat === "mp3" || outputFormat === "wav") {
    return "audio";
  }

  if (
    preset === "Clip com legenda 30s" ||
    preset === "Clip com legenda 45s" ||
    preset === "Clip com legenda podcast 59s" ||
    preset === "Reels 1080x1920" ||
    preset === "Shorts 1080x1920" ||
    preset === "Vertical com blur" ||
    preset === "Vertical com crop central" ||
    preset === "Clip viral 30s" ||
    preset === "Clip viral 45s" ||
    preset === "UGC 20s" ||
    preset === "Podcast 59s" ||
    toolSlug === "video-para-clipe-com-legenda-automatica" ||
    toolSlug === "video-para-clipe-viral" ||
    toolSlug === "video-horizontal-para-vertical"
  ) {
    return "1080x1920";
  }

  if (preset === "TikTok 1080x1920" || preset === "Stories 1080x1920") {
    return "1080x1920";
  }

  if (preset.includes("WhatsApp")) {
    return "720p";
  }

  return "original";
}

async function postJson<T>(url: string, payload: unknown): Promise<ApiResult<T | ErrorPayload>> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = (await response.json().catch(() => ({}))) as T | ErrorPayload;

  return {
    ok: response.ok,
    status: response.status,
    data
  };
}

async function uploadToSignedUrl(
  bucket: string,
  path: string,
  token: string,
  fileBody: Blob | File,
  contentType: string
) {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.storage.from(bucket).uploadToSignedUrl(path, token, fileBody, {
    contentType,
    upsert: true
  });

  if (error) {
    throw new Error(error.message);
  }
}

async function loadCaptionFont(ffmpeg: FFmpeg) {
  const fontName = "NotoSans-Regular.ttf";

  try {
    await ffmpeg.deleteFile(fontName);
  } catch {
    // Ignora se o arquivo nao existir.
  }

  const response = await fetch("/fonts/noto-sans-v27-latin-regular.ttf");
  if (!response.ok) {
    throw new Error("font_download_failed");
  }

  const fontBuffer = new Uint8Array(await response.arrayBuffer());
  await ffmpeg.writeFile(fontName, fontBuffer);
  return fontName;
}

async function createCaptionAudioBlob(
  ffmpeg: FFmpeg,
  inputFsName: string,
  trimStart: number,
  trimEnd: number
) {
  const audioFileName = "caption-audio.wav";

  try {
    await ffmpeg.deleteFile(audioFileName);
  } catch {
    // Ignora se o arquivo nao existir.
  }

  const args = [
    ...(trimEnd > trimStart && trimEnd > 0
      ? ["-ss", trimStart.toFixed(2), "-to", trimEnd.toFixed(2)]
      : []),
    "-i",
    inputFsName,
    "-vn",
    "-ac",
    "1",
    "-ar",
    "16000",
    "-c:a",
    "pcm_s16le",
    audioFileName
  ];

  const exitCode = await ffmpeg.exec(args);
  if (exitCode !== 0) {
    throw new Error(`FFmpeg terminou com codigo ${exitCode} ao preparar a legenda.`);
  }

  const audioData = await ffmpeg.readFile(audioFileName);
  if (!(audioData instanceof Uint8Array)) {
    throw new Error("Nao foi possivel ler o audio para gerar a legenda.");
  }

  const normalizedAudio = new Uint8Array(audioData.byteLength);
  normalizedAudio.set(audioData);

  return new Blob([normalizedAudio], { type: "audio/wav" });
}

export function UploadPanel({ tool }: UploadPanelProps) {
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const loadedCallbacksRef = useRef(false);
  const captionUrlRef = useRef<{ srt: string | null; vtt: string | null }>({
    srt: null,
    vtt: null
  });
  const isAudioTool = isAudioOnlyTool(tool.slug);
  const supportsAutoCaptions = tool.slug === "video-para-clipe-com-legenda-automatica";
  const formatOptions = useMemo(() => getFormatOptions(tool.slug), [tool.slug]);
  const presetOptions = useMemo(() => getPresetOptions(tool.slug), [tool.slug]);
  const isSmartTool =
    tool.slug === "video-para-clipe-com-legenda-automatica" ||
    tool.slug === "video-para-clipe-viral" ||
    tool.slug === "cortar-video-automaticamente" ||
    tool.slug === "video-horizontal-para-vertical" ||
    tool.slug === "criar-trailer-curto";

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("Nenhum arquivo selecionado");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [preset, setPreset] = useState(getDefaultPresetForTool(tool.slug));
  const [outputFormat, setOutputFormat] = useState<OutputFormat>(
    getDefaultOutputFormat(tool.slug)
  );
  const [qualityMode, setQualityMode] = useState<QualityMode>("balanced");
  const [fileSizeMb, setFileSizeMb] = useState(0);
  const [statusMessage, setStatusMessage] = useState(
    "Selecione um arquivo para liberar o processamento local."
  );
  const [syncMessage, setSyncMessage] = useState(
    "Entre para sincronizar historico, projetos e exportacoes no dashboard."
  );
  const [engineReady, setEngineReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [duration, setDuration] = useState(0);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);
  const [videoWidth, setVideoWidth] = useState(0);
  const [videoHeight, setVideoHeight] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadFileName, setDownloadFileName] = useState("");
  const [downloadType, setDownloadType] = useState<"video" | "audio">("video");
  const [captionStatusMessage, setCaptionStatusMessage] = useState(
    supportsAutoCaptions
      ? "A legenda automatica usa IA no navegador e pode levar mais tempo na primeira vez."
      : ""
  );
  const [captionPreviewText, setCaptionPreviewText] = useState("");
  const [captionSrtUrl, setCaptionSrtUrl] = useState<string | null>(null);
  const [captionVttUrl, setCaptionVttUrl] = useState<string | null>(null);
  const [captionBaseFileName, setCaptionBaseFileName] = useState("");
  const [captionRenderMode, setCaptionRenderMode] = useState<"idle" | "burned" | "sidecar">(
    "idle"
  );
  const [isGeneratingCaptions, setIsGeneratingCaptions] = useState(false);
  const [logLines, setLogLines] = useState<string[]>([]);

  const queue = useMemo(() => {
    if (preset.includes("WhatsApp")) {
      return "padrao" as const;
    }

    return preset === "Original" ? ("padrao" as const) : ("rapida" as const);
  }, [preset]);
  const estimate = useUploadEstimate(fileSizeMb, queue);

  useEffect(() => {
    captionUrlRef.current = {
      srt: captionSrtUrl,
      vtt: captionVttUrl
    };
  }, [captionSrtUrl, captionVttUrl]);

  useEffect(() => {
    const defaultPreset = getDefaultPresetForTool(tool.slug);
    const defaultOutputFormat = getDefaultOutputFormat(tool.slug);
    let nextPreset = defaultPreset;
    let nextOutputFormat = defaultOutputFormat;
    let nextQualityMode: QualityMode = "balanced";

    const storageKey = `smartclip:preset:${tool.slug}`;
    const rawValue = window.localStorage.getItem(storageKey);

    if (rawValue) {
      try {
        const parsed = JSON.parse(rawValue) as {
          preset?: string;
          outputFormat?: OutputFormat;
          qualityMode?: QualityMode;
        };

        nextPreset = parsed.preset || defaultPreset;
        nextOutputFormat = parsed.outputFormat || defaultOutputFormat;
        nextQualityMode = parsed.qualityMode || "balanced";
      } catch {
        // Ignora presets locais corrompidos.
      }
    }

    setPreset(nextPreset);
    setOutputFormat(nextOutputFormat);
    setQualityMode(nextQualityMode);
    setStatusMessage("Selecione um arquivo para liberar o processamento local.");
    setSyncMessage("Entre para sincronizar historico, projetos e exportacoes no dashboard.");
    setDownloadUrl(null);
    setDownloadFileName("");
    setCaptionPreviewText("");
    setCaptionBaseFileName("");
    setCaptionRenderMode("idle");
    setIsGeneratingCaptions(false);
    setCaptionStatusMessage(
      supportsAutoCaptions
        ? "A legenda automatica usa IA no navegador e pode levar mais tempo na primeira vez."
        : ""
    );
    if (captionUrlRef.current.srt) {
      URL.revokeObjectURL(captionUrlRef.current.srt);
    }
    if (captionUrlRef.current.vtt) {
      URL.revokeObjectURL(captionUrlRef.current.vtt);
    }
    setCaptionSrtUrl(null);
    setCaptionVttUrl(null);
    setLogLines([]);
    setDuration(0);
    setTrimStart(0);
    setTrimEnd(0);
    setVideoWidth(0);
    setVideoHeight(0);
  }, [supportsAutoCaptions, tool.slug]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }

      if (captionSrtUrl) {
        URL.revokeObjectURL(captionSrtUrl);
      }

      if (captionVttUrl) {
        URL.revokeObjectURL(captionVttUrl);
      }
    };
  }, [captionSrtUrl, captionVttUrl, downloadUrl, previewUrl]);

  useEffect(() => {
    return () => {
      ffmpegRef.current?.terminate();
    };
  }, []);

  const appendLog = (message: string) => {
    setLogLines((current) => [...current.slice(-5), message]);
  };

  const loadEngine = async () => {
    if (ffmpegRef.current?.loaded) {
      setEngineReady(true);
      return ffmpegRef.current;
    }

    const ffmpeg = ffmpegRef.current ?? new FFmpeg();
    ffmpegRef.current = ffmpeg;

    if (!loadedCallbacksRef.current) {
      ffmpeg.on("log", ({ message }) => {
        if (message.trim()) {
          appendLog(message.trim());
        }
      });
      ffmpeg.on("progress", ({ progress: currentProgress }) => {
        setProcessingProgress(Math.round(currentProgress * 100));
      });
      loadedCallbacksRef.current = true;
    }

    setStatusMessage("Baixando o motor FFmpeg. Isso acontece apenas na primeira vez.");
    setProgress(12);

    const baseUrl = "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/umd";

    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseUrl}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${baseUrl}/ffmpeg-core.wasm`, "application/wasm"),
      workerURL: await toBlobURL(`${baseUrl}/ffmpeg-core.worker.js`, "text/javascript")
    });

    setEngineReady(true);
    setProgress(28);
    setStatusMessage("Motor pronto. Agora voce ja pode processar o arquivo.");
    return ffmpeg;
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
      setDownloadFileName("");
    }
    if (captionSrtUrl) {
      URL.revokeObjectURL(captionSrtUrl);
      setCaptionSrtUrl(null);
    }
    if (captionVttUrl) {
      URL.revokeObjectURL(captionVttUrl);
      setCaptionVttUrl(null);
    }

    setSelectedFile(file);
    setFileName(file.name);
    setPreviewUrl(URL.createObjectURL(file));
    setFileSizeMb(Number((file.size / (1024 * 1024)).toFixed(1)));
    setProgress(18);
    setProcessingProgress(0);
    setStatusMessage(
      "Arquivo carregado. Ajuste trim, preset e formato antes de processar."
    );
    setSyncMessage("Entre para sincronizar historico, projetos e exportacoes no dashboard.");
    setDuration(0);
    setTrimStart(0);
    setTrimEnd(0);
    setVideoWidth(0);
    setVideoHeight(0);
    setCaptionPreviewText("");
    setCaptionBaseFileName("");
    setCaptionRenderMode("idle");
    setIsGeneratingCaptions(false);
    setCaptionStatusMessage(
      supportsAutoCaptions
        ? "Arquivo pronto para clip 1080p. A legenda automatica sera criada quando voce iniciar o processamento."
        : ""
    );
    setLogLines([]);
  };

  const handleLoadedMetadata = (element: HTMLVideoElement) => {
    if (!Number.isFinite(element.duration) || element.duration <= 0) {
      return;
    }

    setDuration(element.duration);
    setTrimEnd(element.duration);
    setVideoWidth(element.videoWidth || 0);
    setVideoHeight(element.videoHeight || 0);
    setProgress(30);
  };

  const persistPreset = async () => {
    const storageKey = `smartclip:preset:${tool.slug}`;
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        preset,
        outputFormat,
        qualityMode
      })
    );

    const presetResponse = await postJson("/api/presets", {
      toolSlug: tool.slug,
      name: `${tool.title} · ${preset}`,
      config: {
        preset,
        outputFormat,
        qualityMode
      }
    });

    if (presetResponse.ok) {
      setSyncMessage("Preset salvo no navegador e na sua conta SmartClip.");
      return;
    }

    if (presetResponse.status === 401) {
      setSyncMessage(
        "Preset salvo neste navegador. Entre para guardar essa configuracao no dashboard."
      );
      return;
    }

    setSyncMessage(
      `Preset salvo localmente, mas o envio para sua conta falhou: ${getApiError(
        presetResponse.data,
        "preset_sync_failed"
      )}`
    );
  };

  const syncWithDashboard = async (
    sourceFile: File,
    outputBlob: Blob,
    outputFileName: string,
    outputMimeType: string
  ) => {
    setIsSyncing(true);
    setSyncMessage("Sincronizando arquivo, exportacao e projeto com o dashboard...");

    try {
      const sourceUploadResponse = await postJson<UploadPrepareResponse>("/api/uploads", {
        fileName: sourceFile.name,
        mimeType: sourceFile.type || "video/mp4",
        sizeBytes: sourceFile.size
      });

      if (sourceUploadResponse.status === 401) {
        setSyncMessage(
          "Resultado pronto no navegador. Entre para salvar historico, projetos e exportacoes na sua conta."
        );
        return;
      }

      if (!sourceUploadResponse.ok) {
        throw new Error(
          getApiError(sourceUploadResponse.data, "upload_prepare_failed")
        );
      }

      const sourceUploadData = sourceUploadResponse.data as UploadPrepareResponse;

      await uploadToSignedUrl(
        sourceUploadData.bucket,
        sourceUploadData.upload.path,
        sourceUploadData.upload.token,
        sourceFile,
        sourceFile.type || "video/mp4"
      );

      const sourceVideoId = sourceUploadData.video.id;

      await postJson("/api/uploads/complete", {
        videoId: sourceVideoId,
        durationSeconds: duration > 0 ? Math.round(duration) : undefined,
        width: videoWidth || undefined,
        height: videoHeight || undefined
      });

      const jobResponse = await postJson<JobCreateResponse>("/api/jobs", {
        toolSlug: tool.slug,
        sourceFile: sourceFile.name,
        sourceVideoId,
        preset
      });

      const jobData = jobResponse.data as JobCreateResponse;
      const processingJobId =
        jobResponse.ok && jobData.job?.id ? jobData.job.id : undefined;

      await persistPreset();

      const exportPrepareResponse = await postJson<ExportPrepareResponse>("/api/exports", {
        fileName: outputFileName,
        mimeType: outputMimeType,
        sizeBytes: outputBlob.size,
        toolSlug: tool.slug,
        outputFormat,
        resolution: getResolutionLabel(tool.slug, preset, outputFormat),
        watermarkEnabled: false,
        videoId: sourceVideoId,
        processingJobId
      });

      if (!exportPrepareResponse.ok) {
        throw new Error(
          getApiError(exportPrepareResponse.data, "export_prepare_failed")
        );
      }

      const exportPrepareData = exportPrepareResponse.data as ExportPrepareResponse;

      await uploadToSignedUrl(
        exportPrepareData.bucket,
        exportPrepareData.upload.path,
        exportPrepareData.upload.token,
        outputBlob,
        outputMimeType
      );

      const exportId = exportPrepareData.export.id;

      await postJson("/api/exports/complete", {
        exportId,
        processingJobId
      });

      const projectResponse = await postJson("/api/projects", {
        toolSlug: tool.slug,
        videoId: sourceVideoId,
        lastExportId: exportId,
        name: createProjectName(sourceFile.name, preset),
        config: {
          preset,
          outputFormat,
          qualityMode,
          trimStart,
          trimEnd,
          sourceFileName: sourceFile.name
        }
      });

      if (!projectResponse.ok && projectResponse.status !== 400) {
        throw new Error(getApiError(projectResponse.data, "project_sync_failed"));
      }

      if (!projectResponse.ok && projectResponse.status === 400) {
        setSyncMessage(
          "Arquivo e exportacao salvos no dashboard. O limite de projetos do seu plano foi atingido."
        );
        return;
      }

      setSyncMessage(
        "Upload, exportacao, preset e projeto foram sincronizados no seu dashboard SmartClip."
      );
    } catch (error) {
      setSyncMessage(
        error instanceof Error
          ? `O resultado ficou pronto, mas a sincronizacao falhou: ${error.message}`
          : "O resultado ficou pronto, mas a sincronizacao com o dashboard falhou."
      );
    } finally {
      setIsSyncing(false);
    }
  };

  const handleProcess = async () => {
    if (!selectedFile) {
      setStatusMessage("Escolha um arquivo antes de processar.");
      return;
    }

    setIsProcessing(true);
    setProcessingProgress(0);
    setProgress(36);
    setStatusMessage("Preparando arquivos para processamento...");
    setLogLines([]);
    setCaptionRenderMode("idle");
    setIsGeneratingCaptions(false);

    if (captionSrtUrl) {
      URL.revokeObjectURL(captionSrtUrl);
      setCaptionSrtUrl(null);
    }

    if (captionVttUrl) {
      URL.revokeObjectURL(captionVttUrl);
      setCaptionVttUrl(null);
    }

    try {
      const ffmpeg = await loadEngine();
      const inputExtension =
        selectedFile.name.split(".").pop()?.toLowerCase() || "mp4";
      const inputFsName = `input.${inputExtension}`;
      const resolvedWindow = resolveOutputWindow({
        toolSlug: tool.slug,
        preset,
        trimStart,
        trimEnd: duration > 0 ? trimEnd : 0,
        duration
      });
      const captionBaseName = selectedFile.name
        .replace(/\.[^.]+$/, "")
        .replace(/[^a-zA-Z0-9._-]/g, "-");
      let hasGeneratedCaptionFiles = false;
      let generatedCaptionText = "";
      let burnedCaptionConfig:
        | {
            captions: Awaited<ReturnType<typeof generateAutomaticCaptions>>["captions"];
            fontFileName: string;
          }
        | undefined;
      let nextCaptionRenderMode: "idle" | "burned" | "sidecar" = "idle";

      try {
        await ffmpeg.deleteFile(inputFsName);
      } catch {
        // Ignora se o arquivo nao existir.
      }

      await ffmpeg.writeFile(inputFsName, await fetchFile(selectedFile));

      if (supportsAutoCaptions) {
        setIsGeneratingCaptions(true);
        setCaptionStatusMessage("Extraindo o audio do trecho para criar a legenda automatica...");

        const captionAudioBlob = await createCaptionAudioBlob(
          ffmpeg,
          inputFsName,
          resolvedWindow.trimStart,
          resolvedWindow.trimEnd
        );

        setCaptionStatusMessage(
          "Gerando legenda automatica com IA no navegador. A primeira vez pode baixar um modelo maior."
        );

        const captionResult = await generateAutomaticCaptions(captionAudioBlob);
        generatedCaptionText = captionResult.fullText;
        setCaptionPreviewText(captionResult.fullText);

        if (captionResult.captions.length > 0) {
          hasGeneratedCaptionFiles = true;
          const captionVttBlob = new Blob([buildCaptionVtt(captionResult.captions)], {
            type: "text/vtt"
          });
          const captionSrtBlob = new Blob([buildCaptionSrt(captionResult.captions)], {
            type: "application/x-subrip"
          });

          setCaptionVttUrl(URL.createObjectURL(captionVttBlob));
          setCaptionSrtUrl(URL.createObjectURL(captionSrtBlob));
          setCaptionBaseFileName(`${captionBaseName}-${tool.slug}`);

          try {
            const fontFileName = await loadCaptionFont(ffmpeg);
            burnedCaptionConfig = {
              captions: captionResult.captions,
              fontFileName
            };
            nextCaptionRenderMode = "burned";
            setCaptionStatusMessage("Legenda pronta. Vou aplicar no clipe 1080p agora.");
          } catch {
            nextCaptionRenderMode = "sidecar";
            setCaptionStatusMessage(
              "Legenda pronta para download. Se a queima no video nao estiver disponivel, o clip sai em 1080p com SRT e VTT separados."
            );
          }
        } else {
          setCaptionStatusMessage(
            "Nao foi possivel montar legendas desse audio. O clipe 1080p sera exportado sem texto."
          );
        }
      }

      const createPlan = (withBurnedCaptions: boolean) =>
        buildProcessingPlan({
          toolSlug: tool.slug,
          inputFileName: selectedFile.name,
          outputFormat,
          qualityMode,
          preset,
          trimStart,
          trimEnd: duration > 0 ? trimEnd : 0,
          duration,
          burnedCaptions: withBurnedCaptions ? burnedCaptionConfig : undefined
        });

      let plan = createPlan(Boolean(burnedCaptionConfig));

      try {
        await ffmpeg.deleteFile(plan.outputFileName);
      } catch {
        // Ignora se o arquivo nao existir.
      }

      setStatusMessage(
        supportsAutoCaptions && burnedCaptionConfig
          ? "Aplicando legenda automatica e exportando o clipe 1080p..."
          : "Processando com FFmpeg no navegador..."
      );
      setProgress(52);

      let exitCode = await ffmpeg.exec(plan.args);

      if (exitCode !== 0 && burnedCaptionConfig) {
        nextCaptionRenderMode = "sidecar";
        setCaptionStatusMessage(
          "Seu navegador nao conseguiu queimar a legenda no video. O clip 1080p segue pronto com a legenda em SRT e VTT."
        );

        try {
          await ffmpeg.deleteFile(plan.outputFileName);
        } catch {
          // Ignora se o arquivo nao existir.
        }

        plan = createPlan(false);
        exitCode = await ffmpeg.exec(plan.args);
      }

      if (exitCode !== 0) {
        throw new Error(`FFmpeg terminou com codigo ${exitCode}.`);
      }

      const outputData = await ffmpeg.readFile(plan.outputFileName);
      if (!(outputData instanceof Uint8Array)) {
        throw new Error("Nao foi possivel ler o arquivo processado.");
      }

      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }

      const normalizedOutput = new Uint8Array(outputData.byteLength);
      normalizedOutput.set(outputData);
      const outputBlob = new Blob([normalizedOutput.buffer], {
        type: plan.outputMimeType
      });
      const nextDownloadUrl = URL.createObjectURL(outputBlob);

      setDownloadUrl(nextDownloadUrl);
      setDownloadFileName(plan.outputFileName);
      setDownloadType(plan.outputMimeType.startsWith("audio/") ? "audio" : "video");
      setCaptionRenderMode(nextCaptionRenderMode);
      setProgress(100);
      setProcessingProgress(100);
      setStatusMessage(
        `Resultado pronto em ${plan.outputLabel}. Baixe agora ou processe outro preset.`
      );

      if (supportsAutoCaptions) {
        if (nextCaptionRenderMode === "burned") {
          setCaptionStatusMessage(
            "Legenda automatica aplicada no clipe 1080p. O video ja sai mais pronto para redes sociais."
          );
        } else if (hasGeneratedCaptionFiles) {
          setCaptionStatusMessage(
            "Clip 1080p pronto. Se quiser, baixe tambem a legenda automatica em SRT ou VTT."
          );
        } else if (generatedCaptionText) {
          setCaptionStatusMessage(
            "A transcricao foi lida, mas nao virou blocos de legenda confiaveis. O clip 1080p saiu sem texto."
          );
        }
      }

      await syncWithDashboard(
        selectedFile,
        outputBlob,
        plan.outputFileName,
        plan.outputMimeType
      );
    } catch (error) {
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "O processamento falhou. Tente um arquivo menor ou outro formato."
      );
      if (supportsAutoCaptions) {
        setCaptionStatusMessage(
          error instanceof Error
            ? `A etapa de legenda automatica falhou: ${error.message}`
            : "A etapa de legenda automatica falhou nesse navegador."
        );
      }
    } finally {
      setIsGeneratingCaptions(false);
      setIsProcessing(false);
    }
  };

  const handlePrimaryAction = async () => {
    if (!selectedFile) {
      fileInputRef.current?.click();
      return;
    }

    await handleProcess();
  };

  return (
    <Card
      className="border-primary/20 bg-[#081227]/90 shadow-glow"
      id="smartclip-uploader"
    >
      <CardContent className="space-y-6 p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-primary">
              {tool.attentionLabel}
            </p>
            <h2 className="mt-2 font-display text-2xl text-white">{tool.title}</h2>
          </div>
          <div className="rounded-[1.25rem] border border-white/10 bg-white/6 px-4 py-3 text-sm text-white/75">
            {tool.promise}
          </div>
        </div>

        <label className="block rounded-[1.75rem] border border-dashed border-primary/35 bg-gradient-to-br from-primary/10 to-transparent p-6 text-center transition hover:border-primary/60">
          <input
            accept="video/*"
            className="hidden"
            onChange={handleFileChange}
            ref={fileInputRef}
            type="file"
          />
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/12 text-primary">
            <Upload className="h-6 w-6" />
          </div>
          <p className="mt-4 font-medium text-white">
            Arraste o video aqui ou toque para escolher
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            O processamento roda no proprio navegador para liberar uso imediato.
            {isSmartTool
              ? " Esta ferramenta aplica um fluxo mais inteligente para deixar o resultado mais pronto para publicar."
              : ""}
          </p>
        </label>

        <div className="grid gap-4 lg:grid-cols-[1fr,0.9fr]">
          <div className="space-y-4 rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Arquivo atual</p>
              <span className="text-sm text-white/70">{fileSizeMb || 0} MB</span>
            </div>
            <p className="font-medium text-white">{fileName}</p>
            <Progress value={progress} />
            <div className="flex flex-wrap gap-2">
              {tool.platforms.map((platform) => (
                <span
                  className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/55"
                  key={platform}
                >
                  {platform}
                </span>
              ))}
            </div>
            {(videoWidth || videoHeight) && !isAudioTool ? (
              <p className="text-xs uppercase tracking-[0.16em] text-white/45">
                Resolucao de origem: {videoWidth} x {videoHeight}
              </p>
            ) : null}
            <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
              {previewUrl ? (
                <video
                  className="aspect-video w-full rounded-2xl object-cover"
                  controls
                  onLoadedMetadata={(event) => handleLoadedMetadata(event.currentTarget)}
                  src={previewUrl}
                />
              ) : (
                <div className="flex aspect-video items-center justify-center rounded-2xl border border-dashed border-white/10 text-sm text-muted-foreground">
                  Preview do video aparece aqui
                </div>
              )}
            </div>

            {duration > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Inicio do corte (seg)</p>
                  <Input
                    max={trimEnd || duration}
                    min={0}
                    onChange={(event) => setTrimStart(Number(event.target.value || 0))}
                    step="0.1"
                    type="number"
                    value={trimStart}
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Fim do corte (seg)</p>
                  <Input
                    max={duration}
                    min={0}
                    onChange={(event) => setTrimEnd(Number(event.target.value || 0))}
                    step="0.1"
                    type="number"
                    value={trimEnd}
                  />
                </div>
              </div>
            ) : null}
          </div>

          <div className="space-y-4 rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-5">
            {!isAudioTool ? (
              <div>
                <p className="text-sm text-muted-foreground">Preset de saida</p>
                <select
                  className="mt-2 h-11 w-full rounded-2xl border border-white/10 bg-[#07101F] px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/60"
                  onChange={(event) => setPreset(event.target.value)}
                  value={preset}
                >
                  {presetOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Formato final</p>
                <select
                  className="mt-2 h-11 w-full rounded-2xl border border-white/10 bg-[#07101F] px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/60"
                  onChange={(event) => setOutputFormat(event.target.value as OutputFormat)}
                  value={outputFormat}
                >
                  {formatOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Qualidade</p>
                <select
                  className="mt-2 h-11 w-full rounded-2xl border border-white/10 bg-[#07101F] px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/60"
                  onChange={(event) => setQualityMode(event.target.value as QualityMode)}
                  value={qualityMode}
                >
                  <option value="smaller">Arquivo menor</option>
                  <option value="balanced">Equilibrado</option>
                  <option value="higher">Mais qualidade</option>
                </select>
              </div>
            </div>

            <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
              <div className="flex items-center gap-3 text-primary">
                <WandSparkles className="h-5 w-5" />
                <span className="text-sm uppercase tracking-[0.2em]">Retencao</span>
              </div>
              <p className="mt-3 text-sm leading-7 text-white/80">
                {tool.retentionPrompt}
              </p>
            </div>

            {supportsAutoCaptions ? (
              <div className="space-y-3 rounded-2xl border border-secondary/20 bg-secondary/10 p-4">
                <p className="text-sm uppercase tracking-[0.2em] text-secondary">
                  Legenda automatica 1080p
                </p>
                <p className="text-sm leading-7 text-white/78">{captionStatusMessage}</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/8 bg-black/20 p-3 text-sm text-white/72">
                    Primeira vez: o navegador baixa o modelo de IA de voz.
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-black/20 p-3 text-sm text-white/72">
                    Resultado: clipe vertical 1080p com legenda queimada ou sidecar SRT/VTT.
                  </div>
                </div>
                {isGeneratingCaptions ? <Progress value={55} /> : null}
                {captionPreviewText ? (
                  <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                      Preview da legenda
                    </p>
                    <p className="mt-3 text-sm leading-7 text-white/78">
                      {captionPreviewText}
                    </p>
                  </div>
                ) : null}
                {(captionSrtUrl || captionVttUrl) ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {captionSrtUrl ? (
                      <Button asChild size="sm" variant="secondary">
                        <a
                          download={`${captionBaseFileName || "smartclip-legenda"}.srt`}
                          href={captionSrtUrl}
                        >
                          Baixar SRT
                        </a>
                      </Button>
                    ) : null}
                    {captionVttUrl ? (
                      <Button asChild size="sm" variant="secondary">
                        <a
                          download={`${captionBaseFileName || "smartclip-legenda"}.vtt`}
                          href={captionVttUrl}
                        >
                          Baixar VTT
                        </a>
                      </Button>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ) : null}

            <div className="space-y-2 rounded-2xl border border-white/8 bg-black/20 p-4">
              <p className="text-sm text-muted-foreground">
                {engineReady
                  ? "Motor FFmpeg pronto"
                  : "Primeira execucao baixa o motor FFmpeg"}
              </p>
              <p className="text-sm leading-7 text-white/78">{statusMessage}</p>
              {selectedFile ? (
                <>
                  <p className="text-xs uppercase tracking-[0.16em] text-white/45">
                    Estimativa de espera: {estimate.estimatedMinutes} min
                  </p>
                  <p className="text-sm leading-7 text-white/60">{estimate.uploadQuality}</p>
                </>
              ) : null}
              {isProcessing ? <Progress value={processingProgress} /> : null}
            </div>

            <div className="space-y-2 rounded-2xl border border-primary/20 bg-primary/8 p-4">
              <p className="text-sm uppercase tracking-[0.2em] text-primary">
                Sync com dashboard
              </p>
              <p className="text-sm leading-7 text-white/78">{syncMessage}</p>
              {isSyncing ? <Progress value={80} /> : null}
            </div>

            {logLines.length > 0 ? (
              <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                <div className="mb-3 flex items-center gap-2 text-primary">
                  <Scissors className="h-4 w-4" />
                  <span className="text-xs uppercase tracking-[0.2em]">
                    Log do processamento
                  </span>
                </div>
                <div className="space-y-2 text-xs leading-6 text-white/70">
                  {logLines.map((line, index) => (
                    <p key={`${line}-${index}`}>{line}</p>
                  ))}
                </div>
              </div>
            ) : null}

            {downloadUrl ? (
              <div className="rounded-2xl border border-success/20 bg-success/10 p-4">
                <p className="text-sm text-success">Resultado pronto para download</p>
                <p className="mt-2 text-sm text-white/85">{downloadFileName}</p>
                {supportsAutoCaptions ? (
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-white/55">
                    {captionRenderMode === "burned"
                      ? "Legenda automatica aplicada no video"
                      : captionRenderMode === "sidecar"
                        ? "Legenda automatica disponivel em SRT/VTT"
                        : "Clip 1080p pronto"}
                  </p>
                ) : null}
                <div className="mt-4 rounded-2xl border border-white/8 bg-black/20 p-3">
                  {downloadType === "audio" ? (
                    <audio className="w-full" controls src={downloadUrl} />
                  ) : (
                    <video className="aspect-video w-full rounded-xl" controls src={downloadUrl} />
                  )}
                </div>
                <div className="mt-4">
                  <Button asChild className="w-full">
                    <a download={downloadFileName} href={downloadUrl}>
                      <Download className="h-4 w-4" />
                      Baixar resultado
                    </a>
                  </Button>
                </div>
              </div>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                disabled={isProcessing || isSyncing}
                onClick={handlePrimaryAction}
              >
                {isProcessing ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    {supportsAutoCaptions ? "Gerando clip com legenda" : "Processando"}
                  </>
                ) : !selectedFile ? (
                  "Iniciar agora"
                ) : supportsAutoCaptions ? (
                  "Gerar clip 1080p com legenda"
                ) : (
                  "Iniciar processamento"
                )}
              </Button>
              <Button
                disabled={isSyncing}
                onClick={() => {
                  void persistPreset();
                }}
                variant="secondary"
              >
                Salvar preset
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
