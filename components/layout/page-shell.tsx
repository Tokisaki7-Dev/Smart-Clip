import type { PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

interface PageShellProps extends PropsWithChildren {
  className?: string;
}

export function PageShell({ className, children }: PageShellProps) {
  return <div className={cn("container py-14 lg:py-20", className)}>{children}</div>;
}
