// components/ui/scrolling-banner.tsx
import * as React from "react";
import Image, { StaticImageData } from "next/image";
import { cn } from "@/lib/utils";

type SrcType = string | StaticImageData;

type ScrollingBannerProps = {
  src: SrcType;          // peut être import statique ou string "/…"
  alt?: string;
  height?: number;       // hauteur d’affichage
  itemWidth?: number;    // requis si src est string (largeur réelle du PNG/SVG)
  count?: number;        // nb d’items par moitié
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
  // si import statique: on connaît width/height réels du fichier
  const realW =
    typeof src === "object" && "width" in src && "height" in src
      ? Math.round((height * src.width) / src.height)
      : itemWidth!; // <- si string, DOIT être fourni

  // largeur exacte d’un bloc (image + gap) en pixels entiers
  const block = Math.round(realW + gapPx);

  // largeur à défiler pour boucler sans saut = largeur d'une moitié de piste
  const halfTrack = block * count; // pixels

  const style: React.CSSProperties = {
    // on passe des valeurs exactes à l’anim
    ["--speed" as any]: `${speedSeconds}s`,
    ["--halfTrack" as any]: `${halfTrack}px`,
  };

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden border-y border-border",
        className
      )}
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
  const Item = (i: number) => (
    <Image
      key={i}
      src={src as any}
      alt=""
      height={height}
      width={width}
      className="shrink-0 select-none"
      priority={i < 2}
    />
  );

  return (
    <div
      className="flex items-center shrink-0"
      style={{ columnGap: `${gapPx}px` }}
      aria-hidden={ariaHidden ? "true" : undefined}
    >
      {Array.from({ length: count }).map((_, i) => Item(i))}
    </div>
  );
}
