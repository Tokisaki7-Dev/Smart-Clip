import { format, formatDistanceToNowStrict } from "date-fns";
import { ptBR } from "date-fns/locale";

import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { billingSnapshot } from "@/services/billing";
import { dashboardSnapshot } from "@/services/dashboard";
import { getToolBySlug } from "@/services/tools";
import type { BillingSummary, DashboardSnapshot, PlanId } from "@/types";

const planLimits: Record<
  PlanId,
  {
    dailyExportsLimit: number;
    monthlyAutoClipsLimit: number;
    monthlyCaptionsLimit: number;
    watermarkFreeLimit: number;
    fullHdLimit: number;
  }
> = {
  free: {
    dailyExportsLimit: 18,
    monthlyAutoClipsLimit: 3,
    monthlyCaptionsLimit: 3,
    watermarkFreeLimit: 2,
    fullHdLimit: 2
  },
  starter: {
    dailyExportsLimit: 100,
    monthlyAutoClipsLimit: 25,
    monthlyCaptionsLimit: 25,
    watermarkFreeLimit: Number.MAX_SAFE_INTEGER,
    fullHdLimit: Number.MAX_SAFE_INTEGER
  },
  creator: {
    dailyExportsLimit: Number.MAX_SAFE_INTEGER,
    monthlyAutoClipsLimit: 120,
    monthlyCaptionsLimit: 120,
    watermarkFreeLimit: Number.MAX_SAFE_INTEGER,
    fullHdLimit: Number.MAX_SAFE_INTEGER
  },
  pro: {
    dailyExportsLimit: Number.MAX_SAFE_INTEGER,
    monthlyAutoClipsLimit: Number.MAX_SAFE_INTEGER,
    monthlyCaptionsLimit: Number.MAX_SAFE_INTEGER,
    watermarkFreeLimit: Number.MAX_SAFE_INTEGER,
    fullHdLimit: Number.MAX_SAFE_INTEGER
  }
};

function normalizePlanId(planId?: string | null): PlanId {
  switch ((planId || "").toLowerCase()) {
    case "starter":
      return "starter";
    case "creator":
      return "creator";
    case "pro":
      return "pro";
    default:
      return "free";
  }
}

function formatExpiresIn(dateValue?: string | null) {
  if (!dateValue) {
    return "sem expiracao";
  }

  return formatDistanceToNowStrict(new Date(dateValue), {
    addSuffix: false,
    locale: ptBR
  });
}

function formatDateLabel(dateValue?: string | null) {
  if (!dateValue) {
    return "agora";
  }

  return format(new Date(dateValue), "dd 'de' MMM, HH:mm", {
    locale: ptBR
  });
}

function buildTrialMessage(trialEndsAt?: string | null) {
  if (!trialEndsAt) {
    return billingSnapshot.trialMessage;
  }

  const daysLeft = Math.max(
    0,
    Math.ceil(
      (new Date(trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )
  );

  if (daysLeft === 0) {
    return "Seu trial termina hoje. Revise billing para nao interromper o fluxo.";
  }

  return `Faltam ${daysLeft} dias do trial para converter sem interromper seus uploads.`;
}

export async function getDashboardSnapshot(): Promise<DashboardSnapshot> {
  if (!isSupabaseConfigured()) {
    return dashboardSnapshot;
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return dashboardSnapshot;
  }

  const now = new Date();
  const dayKey = now.toISOString().slice(0, 10);
  const monthKey = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
  const dayStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  ).toISOString();

  const [
    profileResult,
    subscriptionResult,
    walletResult,
    presetResult,
    filesResult,
    exportsResult,
    projectsResult,
    processingJobsResult,
    dailyExportsCountResult,
    autoClipCountResult,
    captionCountResult,
    watermarkFreeCountResult,
    fullHdCountResult
  ] = await Promise.all([
    supabase
      .from("users")
      .select("email, full_name, current_plan")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("subscriptions")
      .select("plan_id, status, trial_ends_at, current_period_end")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("credit_wallets")
      .select("balance")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("saved_presets")
      .select("name")
      .eq("user_id", user.id)
      .order("last_used_at", { ascending: false, nullsFirst: false })
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("videos")
      .select("original_name, size_bytes, retention_ends_at, status")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("exports")
      .select("id, tool_slug, storage_path, output_format, resolution, status, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("projects")
      .select("name, tool_slug, updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(2),
    supabase
      .from("processing_jobs")
      .select("id, type, status, created_at, output, input")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(4),
    supabase
      .from("exports")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", dayStart),
    supabase
      .from("processing_jobs")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("type", "auto_clip")
      .gte("created_at", monthStart),
    supabase
      .from("processing_jobs")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("type", "auto_caption")
      .gte("created_at", monthStart),
    supabase
      .from("exports")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("watermark_enabled", false)
      .gte("created_at", monthStart),
    supabase
      .from("exports")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("resolution", "1080p")
      .gte("created_at", monthStart)
  ]);

  const planId = normalizePlanId(
    subscriptionResult.data?.plan_id || profileResult.data?.current_plan
  );
  const limits = planLimits[planId];

  const dailyExportsUsed = dailyExportsCountResult.count || 0;
  const monthlyAutoClipsUsed = autoClipCountResult.count || 0;
  const monthlyCaptionsUsed = captionCountResult.count || 0;
  const watermarkFreeUsed = watermarkFreeCountResult.count || 0;
  const fullHdUsed = fullHdCountResult.count || 0;
  const trialEndsAt = subscriptionResult.data?.trial_ends_at || null;

  const recentFiles =
    filesResult.data?.map((file) => ({
      name: file.original_name,
      size: `${Number(file.size_bytes) / (1024 * 1024) < 1 ? "< 1" : Math.round(Number(file.size_bytes) / (1024 * 1024))} MB`,
      expiresIn: formatExpiresIn(file.retention_ends_at),
      status: String(file.status || "ready")
    })) || dashboardSnapshot.recentFiles;

  const recentExports =
    exportsResult.data?.map((item) => ({
      id: item.id,
      name: item.storage_path.split("/").pop() || item.storage_path,
      format: item.output_format,
      resolution: item.resolution,
      status: String(item.status || "completed"),
      finishedAt: formatDateLabel(item.created_at),
      toolSlug: item.tool_slug
    })) || dashboardSnapshot.recentExports;

  const recentProjects =
    projectsResult.data?.map((project) => ({
      name: project.name,
      tool: project.tool_slug,
      lastEdited: formatDateLabel(project.updated_at)
    })) || dashboardSnapshot.recentProjects;

  const processingJobs =
    processingJobsResult.data?.map((job) => {
      const rawOutputs = Array.isArray((job.output as { clips?: unknown[] } | null)?.clips)
        ? (((job.output as { clips?: Array<Record<string, unknown>> })?.clips || []) as Array<
            Record<string, unknown>
          >)
        : [];

      return {
        id: job.id,
        tool:
          getToolBySlug(
            String((job.input as { toolSlug?: string } | null)?.toolSlug || "")
          )?.title || String((job.input as { toolSlug?: string } | null)?.toolSlug || job.type),
        status: String(job.status),
        createdAt: formatDateLabel(job.created_at),
        modeLabel:
          job.type === "auto_caption"
            ? "Legenda automatica"
            : job.type === "auto_clip"
              ? "Clipes automaticos"
              : "Processamento",
        outputs: rawOutputs.map((clip, index) => ({
          id: String(clip.exportId || `${job.id}-${index}`),
          label: String(clip.label || `Clip ${index + 1}`),
          resolution: String(clip.resolution || "1080p"),
          status: String(clip.status || "completed")
        }))
      };
    }) || dashboardSnapshot.processingJobs;

  return {
    userName:
      profileResult.data?.full_name?.trim() ||
      user.user_metadata?.full_name ||
      user.email?.split("@")[0] ||
      dashboardSnapshot.userName,
    currentPlan: planId,
    trialDaysLeft: trialEndsAt
      ? Math.max(
          0,
          Math.ceil(
            (new Date(trialEndsAt).getTime() - Date.now()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0,
    dailyExportsUsed,
    dailyExportsLimit: limits.dailyExportsLimit,
    monthlyAutoClipsUsed,
    monthlyAutoClipsLimit: limits.monthlyAutoClipsLimit,
    monthlyCaptionsUsed,
    monthlyCaptionsLimit: limits.monthlyCaptionsLimit,
    watermarkFreeRemaining:
      limits.watermarkFreeLimit === Number.MAX_SAFE_INTEGER
        ? Number.MAX_SAFE_INTEGER
        : Math.max(0, limits.watermarkFreeLimit - watermarkFreeUsed),
    fullHdRemaining:
      limits.fullHdLimit === Number.MAX_SAFE_INTEGER
        ? Number.MAX_SAFE_INTEGER
        : Math.max(0, limits.fullHdLimit - fullHdUsed),
    creditsRemaining: walletResult.data?.balance ?? dashboardSnapshot.creditsRemaining,
    lastPreset: presetResult.data?.name || dashboardSnapshot.lastPreset,
    expirationLabel:
      recentFiles.length > 0
        ? `Seu arquivo principal fica disponivel por mais ${recentFiles[0].expiresIn}.`
        : "Seus proximos uploads aparecerao aqui com o tempo restante ate expirar.",
    recentFiles,
    recentExports,
    recentProjects,
    processingJobs
  };
}

export async function getBillingSummary(): Promise<BillingSummary> {
  if (!isSupabaseConfigured()) {
    return billingSnapshot;
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return billingSnapshot;
  }

  const [profileResult, subscriptionResult, walletResult, paymentResult] =
    await Promise.all([
      supabase
        .from("users")
        .select("current_plan")
        .eq("id", user.id)
        .maybeSingle(),
      supabase
        .from("subscriptions")
        .select("plan_id, status, trial_ends_at, current_period_end")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("credit_wallets")
        .select("balance")
        .eq("user_id", user.id)
        .maybeSingle(),
      supabase
        .from("payment_attempts")
        .select("payment_method, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()
    ]);

  const currentPlan = normalizePlanId(
    subscriptionResult.data?.plan_id || profileResult.data?.current_plan
  );
  const trialMessage =
    subscriptionResult.data?.status === "trial"
      ? buildTrialMessage(subscriptionResult.data?.trial_ends_at)
      : `Seu plano atual e ${currentPlan}. Ajuste upgrade ou cancelamento no painel.`;
  const nextCharge = subscriptionResult.data?.current_period_end
    ? format(new Date(subscriptionResult.data.current_period_end), "dd 'de' MMMM 'de' yyyy", {
        locale: ptBR
      })
    : "Nao ha cobranca agendada";
  const paymentMethod = paymentResult.data?.payment_method
    ? `Metodo atual: ${paymentResult.data.payment_method}`
    : "Nenhum metodo salvo ainda";

  return {
    currentPlan: currentPlan.toUpperCase(),
    trialMessage,
    nextCharge,
    paymentMethod,
    creditBalance: walletResult.data?.balance ?? 0,
    nextRecommendedAction:
      currentPlan === "free"
        ? "Ative o Starter quando quiser remover marca d'agua e liberar 1080p sempre."
        : currentPlan === "starter"
          ? "Se suas automacoes mensais passarem de 25, o Creator tende a reduzir custo por uso."
          : "Seu plano ja cobre uso recorrente. Ajuste billing apenas quando o volume mudar."
  };
}
