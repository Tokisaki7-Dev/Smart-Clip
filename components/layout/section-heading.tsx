import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left"
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex max-w-3xl flex-col gap-4",
        align === "center" && "mx-auto items-center text-center"
      )}
    >
      {eyebrow ? <Badge variant="primary">{eyebrow}</Badge> : null}
      <div className="space-y-3">
        <h2 className="font-display text-3xl leading-tight text-white sm:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="text-base leading-7 text-muted-foreground sm:text-lg">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
