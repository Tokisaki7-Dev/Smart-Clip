import type { PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

interface PageShellProps extends PropsWithChildren {
  className?: string;
}

export function PageShell({ className, children }: PageShellProps) {
  return <div className={cn("container py-12 lg:py-16", className)}>{children}</div>;
}
