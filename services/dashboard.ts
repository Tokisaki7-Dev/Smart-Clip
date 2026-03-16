import type { DashboardSnapshot } from "@/types";

export const dashboardSnapshot: DashboardSnapshot = {
  userName: "Endri",
  currentPlan: "free",
  trialDaysLeft: 0,
  dailyExportsUsed: 12,
  dailyExportsLimit: 18,
  monthlyAutoClipsUsed: 1,
  monthlyAutoClipsLimit: 3,
  monthlyCaptionsUsed: 2,
  monthlyCaptionsLimit: 3,
  watermarkFreeRemaining: 1,
  fullHdRemaining: 2,
  creditsRemaining: 6,
  lastPreset: "Reels 1080x1920",
  expirationLabel: "Seu arquivo principal fica disponivel por mais 29 horas.",
  recentFiles: [
    {
      name: "podcast-corte-episodio-12.mp4",
      size: "412 MB",
      expiresIn: "29 horas",
      status: "Pronto para novo corte"
    },
    {
      name: "ugc-produto-lancamento.mov",
      size: "688 MB",
      expiresIn: "34 horas",
      status: "Convertido para MP4"
    },
    {
      name: "entrevista-whatsapp.mp4",
      size: "95 MB",
      expiresIn: "46 horas",
      status: "Compactado"
    }
  ],
  recentExports: [
    {
      id: "demo-export-1",
      name: "podcast-corte-episodio-12-reels.mp4",
      format: "MP4",
      resolution: "720p",
      status: "completed",
      finishedAt: "Hoje, 13:42",
      toolSlug: "video-para-reels"
    },
    {
      id: "demo-export-2",
      name: "teaser-whatsapp-compactado.mp4",
      format: "MP4",
      resolution: "720p",
      status: "completed",
      finishedAt: "Hoje, 11:18",
      toolSlug: "video-para-anuncio-curto"
    },
    {
      id: "demo-export-3",
      name: "entrevista-audio.mp3",
      format: "MP3",
      resolution: "Audio",
      status: "completed",
      finishedAt: "Ontem, 21:05",
      toolSlug: "extrair-audio"
    }
  ],
  recentProjects: [
    {
      name: "Reels semanais do podcast",
      tool: "Video para Reels",
      lastEdited: "Hoje"
    },
    {
      name: "Presets de atendimento WhatsApp",
      tool: "Video para WhatsApp",
      lastEdited: "Ontem"
    }
  ],
  processingJobs: [
    {
      id: "demo-job-1",
      tool: "Transformar video em clipe com legenda automatica",
      status: "processing",
      createdAt: "Hoje, 14:05",
      modeLabel: "Worker premium",
      outputs: []
    },
    {
      id: "demo-job-2",
      tool: "Gerar varios clipes automaticos do mesmo video",
      status: "completed",
      createdAt: "Hoje, 09:22",
      modeLabel: "Ate 3 clipes",
      outputs: [
        {
          id: "demo-export-1",
          label: "Clip 1",
          resolution: "1080p",
          status: "completed"
        }
      ]
    }
  ]
};
