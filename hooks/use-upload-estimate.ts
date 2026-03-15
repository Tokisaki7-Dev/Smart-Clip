"use client";

import { useMemo } from "react";

export function useUploadEstimate(fileSizeMb: number, queue: "padrao" | "rapida" | "prioritaria") {
  return useMemo(() => {
    if (!fileSizeMb) {
      return {
        estimatedMinutes: 0,
        uploadQuality: "Selecione um arquivo para ver a estimativa."
      };
    }

    const multiplier = queue === "prioritaria" ? 0.55 : queue === "rapida" ? 0.75 : 1;
    const estimatedMinutes = Math.max(1, Math.round((fileSizeMb / 95) * multiplier));
    const uploadQuality =
      fileSizeMb > 1024
        ? "Arquivo pesado. Vale usar compressao ou subir para um plano com limite maior."
        : "Arquivo dentro da faixa ideal para um envio rapido.";

    return {
      estimatedMinutes,
      uploadQuality
    };
  }, [fileSizeMb, queue]);
}
