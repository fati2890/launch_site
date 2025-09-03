// src/lib/page-types.ts

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
  site?: SiteMeta;
};
