// src/lib/page.ts
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { unstable_noStore as noStore } from "next/cache";

import type {
  PageBlock,
  PageData,
  SiteMeta,
  HeadingBlock,
  StatsBlock,
  ValuesBlock,
  BannerBlock,
  HeaderBlock,
  FooterBlock,
} from "./page-types";

/** ---------- HELPERS DE NARROWING (parse securisé des blocks) ---------- */
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

const asFooter = (b: any): FooterBlock | null =>
  b?.type === "footer"
    ? {
        type: "footer",
        text: b?.text ? String(b.text) : undefined,
        useSiteNav: b?.useSiteNav === true ? true : undefined,
        links: Array.isArray(b?.links)
          ? b.links
              .filter((x: any) => x && typeof x.label === "string" && typeof x.href === "string")
              .map((x: any) => ({ label: String(x.label), href: String(x.href) }))
          : undefined,
      }
    : null;

const asHeader = (b: any): HeaderBlock | null =>
  b?.type === "header" ? { type: "header" } : null;

/** ---------- LECTURE D’UNE PAGE GENERIQUE ---------- */
export async function getPage(slug: string): Promise<PageData> {
  noStore(); // pas de cache (utile en dev/preview)
  const file = path.join(process.cwd(), "content", "pages", `${slug}.md`);
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
      asBanner(b as any) ||
      asFooter(b as any)     
  )
  .filter(Boolean) as PageBlock[];

  // site meta (optionnelle) -> site: { name, description, nav[] }
  const site: SiteMeta = {
    name: (data as any)?.site?.name ?? undefined,
    description: (data as any)?.site?.description ?? undefined,
    nav: Array.isArray((data as any)?.site?.nav)
      ? (data as any).site.nav
          .filter((it: any) => it && typeof it.label === "string" && typeof it.href === "string")
          .map((it: any) => ({ label: String(it.label), href: String(it.href) }))
      : undefined,
  };
    const showHeader =
    typeof (data as any).showHeader === "boolean" ? (data as any).showHeader : true;

  const showFooter =
    typeof (data as any).showFooter === "boolean" ? (data as any).showFooter : true;



  return {
    title: String(data.title ?? slug),
    blocks,
    site,
    showHeader,   
    showFooter,   
  };
}

/** ---------- ALIAS HOME ---------- */
export async function getHomePage(): Promise<PageData> {
  return getPage("home");
}
