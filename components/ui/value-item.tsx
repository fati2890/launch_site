import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type ValueItemProps = {
  index: number;
  title: string;
  description: string;
  className?: string;
};

export function ValueItem({ index, title, description, className }: ValueItemProps) {
  const num = `${String(index).padStart(2, "0")}.`;

  return (
    <section
      className={cn(
        "grid grid-cols-[1fr_auto] items-start gap-8 border-t border-border py-10",
        className
      )}
      aria-label={title}
    >
      <div>
        <h3 className="relative inline-block leading-none font-light text-primary text-[clamp(2.25rem,6vw,4.25rem)]">
          {title}

          <Image
            src="/trait.png"
            alt=""
            width={200}
            height={10}
            className="absolute -bottom-1 left-0"
          />
        </h3>

        <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
          {description}
        </p>
      </div>

      <div
        className="select-none pr-1 font-light text-primary text-4xl md:text-5xl"
        aria-hidden="true"
      >
        {num}
      </div>
    </section>
  );
}
