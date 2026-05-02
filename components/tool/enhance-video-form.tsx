"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function EnhanceVideoForm() {
  const [videoId, setVideoId] = useState("");
  const [applyUpscaling, setApplyUpscaling] = useState(false);
  const [sharpnessLevel, setSharpnessLevel] = useState(0.5);
  const [noiseReduction, setNoiseReduction] = useState(true);
  const [contrastBoost, setContrastBoost] = useState(0.1);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/video/enhance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoId, applyUpscaling, sharpnessLevel, noiseReduction, contrastBoost }),
    });
    const data = await res.json();
    if (res.ok) {
      // Listen for progress via Supabase Realtime
      supabase
        .channel(`job-${data.jobId}`)
        .on('broadcast', { event: 'progress' }, (payload) => {
          setProgress(payload.percent);
          setMessage(payload.message);
        })
        .subscribe();
    } else {
      setMessage(data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        placeholder="Video ID"
        value={videoId}
        onChange={(e) => setVideoId(e.target.value)}
        required
      />
      <label>
        <input
          type="checkbox"
          checked={applyUpscaling}
          onChange={(e) => setApplyUpscaling(e.target.checked)}
        />
        Aplicar Upscaling (Real-ESRGAN)
      </label>
      <Input
        type="number"
        step="0.1"
        min="0"
        max="1"
        placeholder="Nível de Nitidez"
        value={sharpnessLevel}
        onChange={(e) => setSharpnessLevel(parseFloat(e.target.value))}
      />
      <label>
        <input
          type="checkbox"
          checked={noiseReduction}
          onChange={(e) => setNoiseReduction(e.target.checked)}
        />
        Redução de Ruído
      </label>
      <Input
        type="number"
        step="0.1"
        min="0"
        max="1"
        placeholder="Aumento de Contraste"
        value={contrastBoost}
        onChange={(e) => setContrastBoost(parseFloat(e.target.value))}
      />
      <Button type="submit">Melhorar Vídeo</Button>
      {progress > 0 && <Progress value={progress} />}
      {message && <p>{message}</p>}
    </form>
  );
}