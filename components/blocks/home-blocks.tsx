// components/blocks/page-blocks.tsx
import { type PageBlock, type PageData } from "@/lib/page-types";
import SiteHeader from "@/components/layout/site-header";
import { ScrollingBanner } from "@/components/ui/scrolling-banner";
import { StatItem } from "@/components/ui/Stat-item";
import { ValueItem } from "@/components/ui/value-item";

function HeadingView(props: { heading: string; subheading?: string; align?: "left" | "center" | "right" }) {
  const alignClass =
    props.align === "center" ? "text-center" : props.align === "right" ? "text-right" : "text-left";
  return (
    <section className={`py-10 ${alignClass}`}>
      <h1 className="text-5xl md:text-6xl font-bold text-sky-500">{props.heading}</h1>
      {props.subheading ? <p className="mt-3 text-xl md:text-2xl text-muted-foreground">{props.subheading}</p> : null}
    </section>
  );
}

function StatsView(props: { items: { value: string | number; title: string; description?: string }[] }) {
  return (
    <section className="py-12">
      <div className="max-w-3xl mx-auto">
        <div className="grid gap-8 sm:grid-cols-2">
          {props.items.map((s, i) => (
            <StatItem key={`${s.title}-${i}`} value={s.value} title={s.title} description={s.description} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ValuesView(props: { values: { title: string; description: string }[] }) {
  return (
    <section className="max-w-xl mx-auto">
      {props.values.map((it, i) => (
        <ValueItem key={`${it.title}-${i}`} index={i + 1} title={it.title} description={it.description} />
      ))}
    </section>
  );
}

function BannerView(props: { src: string; itemWidth: number; height?: number; speedSeconds?: number; gapPx?: number; count?: number }) {
  return (
    <ScrollingBanner
      src={props.src}
      itemWidth={props.itemWidth}
      height={props.height ?? 92}
      speedSeconds={props.speedSeconds ?? 22}
      gapPx={props.gapPx ?? 64}
      count={props.count ?? 8}
      className="my-8"
    />
  );
}

function renderBlock(block: PageBlock, index: number, site?: PageData["site"]) {
  switch (block.type) {
    case "header":
      return <SiteHeader key={`header-${index}`} site={site} />;

    case "heading":
      return (
        <HeadingView
          key={`heading-${index}`}
          heading={block.heading}
          subheading={block.subheading}
          align={block.align}
        />
      );

    case "stats":
      return <StatsView key={`stats-${index}`} items={block.items ?? []} />;

    case "values":
      return <ValuesView key={`values-${index}`} values={block.values ?? []} />;

    case "banner":
      return (
        <BannerView
          key={`banner-${index}`}
          src={block.src}
          itemWidth={block.itemWidth}
          height={block.height}
          speedSeconds={block.speedSeconds}
          gapPx={block.gapPx}
          count={block.count}
        />
      );


  }
}

export default function PageBlocks({ page }: { page: PageData }) {
  return <>{page.blocks.map((b, i) => renderBlock(b, i, page.site))}</>;
}
