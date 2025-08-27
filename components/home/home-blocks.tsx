import { getHomePage, type PageBlock } from "@/lib/page";
import StatsSection from "@/components/home/stats-section";       // ⚠️ export default
import ValuesSection from "@/components/home/values-section";     // ⚠️ export default
import { ScrollingBanner } from "@/components/ui/scrolling-banner";
import { StatItem } from "@/components/ui/Stat-item";               // si besoin pour inline
import { ValueItem } from "@/components/ui/value-item";             // si besoin pour inline

import SiteHeader from "@/components/home/site-header";


/** Heading simple (style local) */
function HeadingView(props: { heading: string; subheading?: string; align?: "left" | "center" | "right" }) {
  const alignClass =
    props.align === "center" ? "text-center" : props.align === "right" ? "text-right" : "text-left";
  return (
    <section className={`py-10 ${alignClass}`}>
      <h1 className="text-5xl md:text-6xl font-bold text-sky-500">{props.heading}</h1>
      {props.subheading ? (
        <p className="mt-3 text-xl md:text-2xl text-muted-foreground">{props.subheading}</p>
      ) : null}
    </section>
  );
}

async function StatsViewSmart(props: { source?: "lib"; items?: { value: string | number; title: string; description?: string }[] }) {
  // si source=lib -> réutilise TA section stylée (getStats + grid + paddings déjà faits)
  if (props.source === "lib") {
    return <StatsSection />;
  }
  // sinon (inline), on rend une version légère localement
  const items = props.items ?? [];
  return (
    <section className="py-12">
      <div className="max-w-3xl mx-auto">
        <div className="grid gap-8 sm:grid-cols-2">
          {items.map((s, i) => (
            <StatItem key={`${s.title}-${i}`} value={s.value} title={s.title} description={s.description} />
          ))}
        </div>
      </div>
    </section>
  );
}

async function ValuesViewSmart(props: { source?: "lib"; values?: { title: string; description: string }[] }) {
  if (props.source === "lib") {
    return <ValuesSection />; // ta section stylée existante
  }
  const values = props.values ?? [];
  return (
    <section className="max-w-xl mx-auto">
      {values.map((it, i) => (
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

/** RENDERER : mappe chaque block -> composant UI (stylé) */
function renderBlock(block: PageBlock, index: number,site?: any) {
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
      return (
        <StatsViewSmart
          key={`stats-${index}`}
          source={block.source}
          items={block.items}
        />
      );

    case "values":
      return (
        <ValuesViewSmart
          key={`values-${index}`}
          source={block.source}
          values={block.values}
        />
      );

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

export default async function HomeBlocks() {
  const page = await getHomePage();
  if (!page.blocks.length) return null;
  return <>{page.blocks.map((b, i) => renderBlock(b, i, page.site))}</>;
}

