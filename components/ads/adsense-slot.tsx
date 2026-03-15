import { cn } from "@/lib/utils";

interface AdsenseSlotProps {
  label: string;
  className?: string;
}

export function AdsenseSlot({ label, className }: AdsenseSlotProps) {
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <div
      className={cn(
        "rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.04] p-4 text-center text-xs uppercase tracking-[0.24em] text-muted-foreground",
        className
      )}
    >
      Espaco reservado para AdSense: {label}
    </div>
  );
}
