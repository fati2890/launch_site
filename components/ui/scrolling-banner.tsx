// components/ui/scrolling-banner.tsx
import * as React from "react";
import Image, { type StaticImageData } from "next/image";
import { cn } from "@/lib/utils";

type SrcType = string | StaticImageData;

// typer les variables CSS custom:
type CSSVars = React.CSSProperties & {
  "--speed"?: string;
  "--halfTrack"?: string;
};

type ScrollingBannerProps = {
  src: SrcType;
  alt?: string;
  height?: number;
  itemWidth?: number; // requis si src est string
  count?: number;
  gapPx?: number;
  speedSeconds?: number;
  className?: string;
};

export function ScrollingBanner({
  src,
  alt = "",
  height = 92,
  itemWidth,
  count = 8,
  gapPx = 64,
  speedSeconds = 22,
  className,
}: ScrollingBannerProps) {
  // si import statique, on connaît width/height réels
  const realW =
    typeof src === "object" && "width" in src && "height" in src
      ? Math.round((height * src.width) / src.height)
      : (itemWidth ?? 0); // si string, itemWidth doit être fourni

  const block = Math.round(realW + gapPx);
  const halfTrack = block * count;

  const style: CSSVars = {
    "--speed": `${speedSeconds}s`,
    "--halfTrack": `${halfTrack}px`,
  };

  return (
    <div
      className={cn("relative w-full overflow-hidden border-y border-border", className)}
      style={style}
      aria-label={alt}
    >
      <div className="flex will-change-transform animate-marquee-px">
        <BannerRow src={src} height={height} width={realW} gapPx={gapPx} count={count} />
        <BannerRow src={src} height={height} width={realW} gapPx={gapPx} count={count} ariaHidden />
      </div>
    </div>
  );
}

function BannerRow({
  src,
  height,
  width,
  gapPx,
  count,
  ariaHidden = false,
}: {
  src: SrcType;
  height: number;
  width: number;
  gapPx: number;
  count: number;
  ariaHidden?: boolean;
}) {
  return (
    <div
      className="flex items-center shrink-0"
      style={{ columnGap: `${gapPx}px` }}
      aria-hidden={ariaHidden ? "true" : undefined}
    >
      {Array.from({ length: count }).map((_, i) => (
        <Image
          key={i}
          src={src}             
          alt=""
          height={height}
          width={width}
          className="shrink-0 select-none"
          priority={i < 2}
        />
      ))}
    </div>
  );
}
