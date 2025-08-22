import * as React from "react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type StatItemProps = {
  value: string | number;   // ex: 25
  title: string;            // ex: "Customer challenges solved"
  description?: string;     // petit paragraphe
  className?: string;
};

export function StatItem({ value, title, description, className }: StatItemProps) {
  return (
    <article className={cn("flex flex-col gap-2", className)}>
      <div className="text-sky-500 text-5xl font-light leading-none">{value}</div>

      <h4 className="text-sm font-medium leading-6">{title}</h4>

      {description && (
        <p className="text-sm text-muted-foreground leading-7">
          {description}
        </p>
      )}

      <Separator className="mt-4" />
    </article>
  );
}
