import type { PlanId } from "@/types";

export function normalizePlanId(planId?: string | null): PlanId {
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

export const uploadLimits: Record<PlanId, number> = {
  free: 800 * 1024 * 1024,
  starter: Math.round(2.5 * 1024 * 1024 * 1024),
  creator: 8 * 1024 * 1024 * 1024,
  pro: 25 * 1024 * 1024 * 1024
};

export const retentionDays: Record<PlanId, number> = {
  free: 2,
  starter: 7,
  creator: 30,
  pro: 90
};

export const dailyExportLimits: Record<PlanId, number> = {
  free: 18,
  starter: 100,
  creator: Number.MAX_SAFE_INTEGER,
  pro: Number.MAX_SAFE_INTEGER
};

export const projectLimits: Record<PlanId, number> = {
  free: 1,
  starter: 5,
  creator: Number.MAX_SAFE_INTEGER,
  pro: Number.MAX_SAFE_INTEGER
};

export function getRetentionEndsAt(planId: PlanId) {
  return new Date(Date.now() + retentionDays[planId] * 24 * 60 * 60 * 1000).toISOString();
}
