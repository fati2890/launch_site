// --- types déjà présents ---
export type SiteNav = { label: string; href: string };
export type SiteMeta = { name?: string; description?: string; nav?: SiteNav[] };

export type HeadingBlock = {
  type: "heading";
  heading: string;
  subheading?: string;
  align?: "left" | "center" | "right";
};

export type StatItemData = { value: string | number; title: string; description?: string };
export type StatsBlock = {
  type: "stats";
  source?: "lib";
  items?: StatItemData[];
};

export type ValueItemData = { title: string; description: string };
export type ValuesBlock = {
  type: "values";
  source?: "lib";
  values?: ValueItemData[];
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

export type HeaderBlock = { type: "header" };

// --- AJOUTS POUR LE FOOTER ---
export type FooterLink = { label: string; href: string };

export type FooterBlock = {
  type: "footer";
  text?: string;
  links?: FooterLink[];
  useSiteNav?: boolean; // si true: reprend site.nav
};

// ---  Étendre l’union ---
export type PageBlock =
  | HeadingBlock
  | StatsBlock
  | ValuesBlock
  | BannerBlock
  | HeaderBlock
  | FooterBlock; // <- ajouté

  export type FooterData = { text?: string; links?: FooterLink[] };
export type PageData = {
  title: string;
  blocks: PageBlock[];
  site?: SiteMeta;

  showHeader?: boolean;
  showFooter?: boolean;
  footer?: FooterData;
};
