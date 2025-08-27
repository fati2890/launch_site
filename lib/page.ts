import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

import { unstable_noStore as noStore } from "next/cache";

/** ---------- TYPES : SITE META (header) ---------- */
export type SiteNav = { label: string; href: string };
export type SiteMeta = { name?: string; description?: string; nav?: SiteNav[] };

/** ---------- TYPES : BLOCKS ---------- */
export type HeadingBlock = {
  type: "heading";
  heading: string;
  subheading?: string;
  align?: "left" | "center" | "right";
};

export type StatItemData = { value: string | number; title: string; description?: string };
export type StatsBlock = {
  type: "stats";
  source?: "lib";           // si "lib": on appelle getStats() côté renderer
  items?: StatItemData[];   // sinon: items inline
};

export type ValueItemData = { title: string; description: string };
export type ValuesBlock = {
  type: "values";
  source?: "lib";           // si "lib": on appelle getValues() côté renderer
  values?: ValueItemData[]; // sinon: values inline
};

export type BannerBlock = {
  type: "banner";
  src: string;
  itemWidth: number;
  height?: number;
  speedSeconds?: number;
  gapPx?: number;
  count?: number;
};

export type HeaderBlock = { type: "header" }; // SiteHeader

export type PageBlock =
  | HeadingBlock
  | StatsBlock
  | ValuesBlock
  | BannerBlock
  | HeaderBlock;

/** ---------- TYPE : PAGE DATA ---------- */
export type PageData = {
  title: string;
  blocks: PageBlock[];
  site?: SiteMeta;          // <- ajouté : meta du header depuis home.md
};

/** ---------- HELPERS DE NARROWING ---------- */
const asHeading = (b: any): HeadingBlock | null =>
  b?.type === "heading"
    ? {
        type: "heading",
        heading: String(b.heading ?? ""),
        subheading: b?.subheading ? String(b.subheading) : undefined,
        align: (["left", "center", "right"] as const).includes(b?.align) ? b.align : "left",
      }
    : null;

const asStats = (b: any): StatsBlock | null =>
  b?.type === "stats"
    ? {
        type: "stats",
        source: b?.source === "lib" ? "lib" : undefined,
        items: Array.isArray(b?.items)
          ? b.items.map((it: any) => ({
              value:
                typeof it?.value === "number" || typeof it?.value === "string" ? it.value : "",
              title: String(it?.title ?? ""),
              description: it?.description ? String(it.description) : undefined,
            }))
          : undefined,
      }
    : null;

const asValues = (b: any): ValuesBlock | null =>
  b?.type === "values"
    ? {
        type: "values",
        source: b?.source === "lib" ? "lib" : undefined,
        values: Array.isArray(b?.values)
          ? b.values.map((v: any) => ({
              title: String(v?.title ?? ""),
              description: String(v?.description ?? ""),
            }))
          : undefined,
      }
    : null;

const asBanner = (b: any): BannerBlock | null =>
  b?.type === "banner"
    ? {
        type: "banner",
        src: String(b?.src ?? ""),
        itemWidth: Number(b?.itemWidth ?? 0),
        height: b?.height ? Number(b.height) : undefined,
        speedSeconds: b?.speedSeconds ? Number(b.speedSeconds) : undefined,
        gapPx: b?.gapPx ? Number(b.gapPx) : undefined,
        count: b?.count ? Number(b.count) : undefined,
      }
    : null;

const asHeader = (b: any): HeaderBlock | null =>
  b?.type === "header" ? { type: "header" } : null;

/** ---------- LECTURE HOME.MD ---------- */
export async function getHomePage(): Promise<PageData> {
    noStore(); // pas de cache pour la lecture de home.md
  const file = path.join(process.cwd(), "content", "pages", "home.md");
  const raw = await fs.readFile(file, "utf8");
  const { data } = matter(raw);

  // blocks
  const blocksRaw: unknown[] = Array.isArray((data as any).blocks)
    ? (data as any).blocks
    : [];

  const blocks = blocksRaw
    .map(
      (b: unknown) =>
        asHeader(b as any) ||
        asHeading(b as any) ||
        asStats(b as any) ||
        asValues(b as any) ||
        asBanner(b as any)
    )
    .filter(Boolean) as PageBlock[];

  // site meta (optionnelle) depuis home.md -> site: { name, description, nav[] }
  const site: SiteMeta = {
    name: (data as any)?.site?.name ?? undefined,
    description: (data as any)?.site?.description ?? undefined,
    nav: Array.isArray((data as any)?.site?.nav)
      ? (data as any).site.nav
          .filter((it: any) => it && typeof it.label === "string" && typeof it.href === "string")
          .map((it: any) => ({ label: String(it.label), href: String(it.href) }))
      : undefined,
  };

  return {
    title: String(data.title ?? "Home"),
    blocks,
    site,
  };
}
