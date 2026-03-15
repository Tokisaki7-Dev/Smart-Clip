import { automationPacks } from "@/services/billing";

export function getPackById(packId: string) {
  return automationPacks.find((pack) => pack.id === packId);
}

export function describeCreditUsage() {
  return [
    "1 credito pode ser gasto em um clipe automatico premium",
    "1 credito pode desbloquear uma legenda automatica premium",
    "1 credito pode liberar uma exportacao sem marca d'agua extra",
    "1 credito pode liberar uma exportacao em 1080p alem do limite do plano"
  ];
}
