"use client";

import type { CaptionSegment } from "@/lib/tool-processing";

const CAPTION_MODEL_ID = "onnx-community/whisper-tiny";

type WhisperChunk = {
  timestamp: [number, number];
  text: string;
};

type AutomaticSpeechRecognitionOutputLike = {
  text: string;
  chunks?: WhisperChunk[];
};

type AutomaticSpeechRecognitionPipelineLike = (
  audio: string,
  options?: Record<string, unknown>
) => Promise<AutomaticSpeechRecognitionOutputLike>;

let transcriberPromise: Promise<AutomaticSpeechRecognitionPipelineLike> | null = null;
const importFromUrl = new Function(
  "specifier",
  "return import(specifier)"
) as (specifier: string) => Promise<unknown>;

function wrapCaptionText(text: string) {
  const words = text.split(/\s+/).filter(Boolean);

  if (words.length <= 4) {
    return words.join(" ");
  }

  const breakIndex = Math.ceil(words.length / 2);
  return `${words.slice(0, breakIndex).join(" ")}\n${words.slice(breakIndex).join(" ")}`;
}

function normalizeChunkText(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

async function getBlobDuration(blob: Blob) {
  const objectUrl = URL.createObjectURL(blob);

  try {
    const duration = await new Promise<number>((resolve, reject) => {
      const audio = document.createElement("audio");

      audio.preload = "metadata";
      audio.src = objectUrl;
      audio.onloadedmetadata = () => resolve(audio.duration || 0);
      audio.onerror = () => reject(new Error("audio_metadata_failed"));
    });

    return Number.isFinite(duration) ? duration : 0;
  } catch {
    return 0;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function secondsToTimestamp(seconds: number, separator = ".") {
  const totalMilliseconds = Math.max(0, Math.round(seconds * 1000));
  const hours = Math.floor(totalMilliseconds / 3_600_000);
  const minutes = Math.floor((totalMilliseconds % 3_600_000) / 60_000);
  const secs = Math.floor((totalMilliseconds % 60_000) / 1000);
  const milliseconds = totalMilliseconds % 1000;

  return [hours, minutes, secs]
    .map((value) => value.toString().padStart(2, "0"))
    .join(":")
    .concat(`${separator}${milliseconds.toString().padStart(3, "0")}`);
}

function groupCaptionChunks(chunks: WhisperChunk[]) {
  const grouped: CaptionSegment[] = [];
  let words: string[] = [];
  let start = 0;
  let end = 0;

  for (const chunk of chunks) {
    const [chunkStart, chunkEnd] = chunk.timestamp;
    const text = normalizeChunkText(chunk.text);

    if (!text || chunkEnd <= chunkStart) {
      continue;
    }

    if (!words.length) {
      start = chunkStart;
    }

    words.push(text);
    end = chunkEnd;

    const combined = words.join(" ").replace(/\s+/g, " ").trim();
    const shouldFlush =
      words.length >= 6 ||
      combined.length >= 38 ||
      end - start >= 2.8 ||
      /[.!?]$/.test(text);

    if (!shouldFlush) {
      continue;
    }

    grouped.push({
      start,
      end,
      text: wrapCaptionText(combined)
    });

    words = [];
  }

  if (words.length) {
    grouped.push({
      start,
      end: Math.max(start + 1.2, end),
      text: wrapCaptionText(words.join(" ").replace(/\s+/g, " ").trim())
    });
  }

  return grouped;
}

function splitTranscriptIntoPhrases(text: string) {
  const cleanText = normalizeChunkText(text);

  if (!cleanText) {
    return [];
  }

  const sentences = cleanText
    .split(/(?<=[.!?])\s+/)
    .map((item) => item.trim())
    .filter(Boolean);

  if (sentences.length > 1) {
    return sentences.flatMap((sentence) => {
      const words = sentence.split(" ").filter(Boolean);

      if (words.length <= 8) {
        return [sentence];
      }

      const chunks: string[] = [];
      for (let index = 0; index < words.length; index += 6) {
        chunks.push(words.slice(index, index + 6).join(" "));
      }
      return chunks;
    });
  }

  const words = cleanText.split(" ").filter(Boolean);
  const phrases: string[] = [];

  for (let index = 0; index < words.length; index += 6) {
    phrases.push(words.slice(index, index + 6).join(" "));
  }

  return phrases;
}

function buildCaptionSegmentsFromText(text: string, totalDuration: number) {
  const phrases = splitTranscriptIntoPhrases(text);

  if (!phrases.length) {
    return [] as CaptionSegment[];
  }

  const safeDuration = totalDuration > 0 ? totalDuration : Math.max(4, phrases.length * 2.4);
  const totalWords = phrases.reduce(
    (sum, phrase) => sum + phrase.split(/\s+/).filter(Boolean).length,
    0
  );
  let currentTime = 0;

  return phrases.map((phrase, index) => {
    const wordCount = phrase.split(/\s+/).filter(Boolean).length;
    const proportionalDuration =
      totalWords > 0 ? (safeDuration * wordCount) / totalWords : safeDuration / phrases.length;
    const durationForPhrase = Math.max(1.1, Math.min(4.2, proportionalDuration));
    const remainingDuration = Math.max(1.1, safeDuration - currentTime);
    const finalDuration =
      index === phrases.length - 1
        ? remainingDuration
        : Math.min(durationForPhrase, remainingDuration);
    const start = currentTime;
    const end = Math.min(safeDuration, start + finalDuration);

    currentTime = end;

    return {
      start,
      end: Math.max(start + 0.9, end),
      text: wrapCaptionText(phrase)
    } satisfies CaptionSegment;
  });
}

async function getTranscriber() {
  if (transcriberPromise) {
    return transcriberPromise;
  }

  transcriberPromise = (async () => {
    const transformersModule = (await importFromUrl(
      "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1"
    )) as {
      env: {
        allowLocalModels: boolean;
      };
      pipeline: (
        task: string,
        model: string,
        options: Record<string, string>
      ) => Promise<AutomaticSpeechRecognitionPipelineLike>;
    };
    const useWebGpu = typeof navigator !== "undefined" && "gpu" in navigator;
    const env = transformersModule.env;
    const createPipeline = transformersModule.pipeline;

    env.allowLocalModels = false;

    return createPipeline("automatic-speech-recognition", CAPTION_MODEL_ID, {
      device: useWebGpu ? "webgpu" : "wasm",
      dtype: useWebGpu ? "fp16" : "q8"
    });
  })();

  return transcriberPromise;
}

export async function generateAutomaticCaptions(audioBlob: Blob) {
  const transcriber = await getTranscriber();
  const objectUrl = URL.createObjectURL(audioBlob);
  const audioDuration = await getBlobDuration(audioBlob);

  try {
    let output: AutomaticSpeechRecognitionOutputLike;

    try {
      output = (await transcriber(objectUrl, {
        return_timestamps: "word",
        chunk_length_s: 20,
        stride_length_s: 4
      })) as AutomaticSpeechRecognitionOutputLike;
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      const timestampExtractionFailed =
        message.includes("cross attentions") || message.includes("output_attentions=True");

      if (!timestampExtractionFailed) {
        throw error;
      }

      output = (await transcriber(objectUrl, {
        chunk_length_s: 20,
        stride_length_s: 4
      })) as AutomaticSpeechRecognitionOutputLike;
    }

    const chunks = Array.isArray(output.chunks) ? (output.chunks as WhisperChunk[]) : [];
    const captions =
      chunks.length > 0
        ? groupCaptionChunks(chunks)
        : buildCaptionSegmentsFromText(output.text.trim(), audioDuration);

    if (!captions.length && output.text.trim()) {
      return {
        captions: [
          {
            start: 0,
            end: Math.max(4, audioDuration || 4),
            text: wrapCaptionText(output.text.trim())
          }
        ],
        fullText: output.text.trim()
      };
    }

    return {
      captions,
      fullText: output.text.trim()
    };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export function buildCaptionVtt(captions: CaptionSegment[]) {
  return [
    "WEBVTT",
    "",
    ...captions.flatMap((caption, index) => [
      `${index + 1}`,
      `${secondsToTimestamp(caption.start)} --> ${secondsToTimestamp(caption.end)}`,
      caption.text,
      ""
    ])
  ].join("\n");
}

export function buildCaptionSrt(captions: CaptionSegment[]) {
  return captions
    .flatMap((caption, index) => [
      `${index + 1}`,
      `${secondsToTimestamp(caption.start, ",")} --> ${secondsToTimestamp(caption.end, ",")}`,
      caption.text,
      ""
    ])
    .join("\n");
}
