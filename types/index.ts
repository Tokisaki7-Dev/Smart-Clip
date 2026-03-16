export type PlanId = "free" | "starter" | "creator" | "pro";

export type ToolSlug =
  | "video-para-clipe-com-legenda-automatica"
  | "gerar-varios-clipes-automaticos"
  | "podcast-para-clipes"
  | "video-para-anuncio-curto"
  | "video-para-clipe-viral"
  | "cortar-video-automaticamente"
  | "video-horizontal-para-vertical"
  | "criar-trailer-curto"
  | "cortar-video"
  | "extrair-audio"
  | "comprimir-video"
  | "converter-video"
  | "video-para-reels"
  | "video-para-shorts"
  | "video-para-tiktok"
  | "video-para-stories"
  | "video-para-whatsapp"
  | "mov-para-mp4"
  | "mp4-para-mp3";

export interface UsageQuota {
  label: string;
  value: string;
}

export interface Plan {
  id: PlanId;
  name: string;
  price: string;
  monthlyPrice?: number;
  description: string;
  audience: string;
  ctaLabel: string;
  badge?: string;
  highlighted?: boolean;
  trial?: string;
  quotas: UsageQuota[];
  premiumUnlocks: string[];
  retentionHooks: string[];
  limitations?: string[];
}

export interface AutomationPack {
  id: string;
  name: string;
  price: string;
  credits: number;
  useCases: string[];
}

export interface ToolDefinition {
  slug: ToolSlug;
  title: string;
  kicker: string;
  category: string;
  attentionLabel: string;
  shortDescription: string;
  longDescription: string;
  seoTitle: string;
  seoDescription: string;
  supportedOutputs: string[];
  useCases: string[];
  retentionPrompt: string;
  audience: string;
  promise: string;
  platforms: string[];
  featured?: boolean;
}

export interface BlogSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  category: string;
  publishedAt: string;
  readingTime: string;
  keywords: string[];
  sections: BlogSection[];
  relatedTools: ToolSlug[];
}

export interface SeoCluster {
  slug: string;
  title: string;
  description: string;
  intent: string;
  keywords: string[];
  relatedRoutes: string[];
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export interface DashboardSnapshot {
  userName: string;
  currentPlan: PlanId;
  trialDaysLeft: number;
  dailyExportsUsed: number;
  dailyExportsLimit: number;
  monthlyAutoClipsUsed: number;
  monthlyAutoClipsLimit: number;
  monthlyCaptionsUsed: number;
  monthlyCaptionsLimit: number;
  watermarkFreeRemaining: number;
  fullHdRemaining: number;
  creditsRemaining: number;
  lastPreset: string;
  expirationLabel: string;
  recentFiles: Array<{
    name: string;
    size: string;
    expiresIn: string;
    status: string;
  }>;
  recentExports: Array<{
    id: string;
    name: string;
    format: string;
    resolution: string;
    status: string;
    finishedAt: string;
    toolSlug: string;
  }>;
  recentProjects: Array<{
    name: string;
    tool: string;
    lastEdited: string;
  }>;
  processingJobs: Array<{
    id: string;
    tool: string;
    status: string;
    createdAt: string;
    modeLabel: string;
    outputs: Array<{
      id: string;
      label: string;
      resolution: string;
      status: string;
    }>;
  }>;
}

export interface BillingSummary {
  currentPlan: string;
  trialMessage: string;
  nextCharge: string;
  paymentMethod: string;
  creditBalance: number;
  nextRecommendedAction: string;
}
