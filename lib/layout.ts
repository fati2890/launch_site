import fs from "fs/promises";
import path from "path";

export type SiteNav = { label: string; href: string };
export type SiteMeta = { name?: string; description?: string; nav?: SiteNav[] };
export type FooterLink = { label: string; href: string };
export type FooterData = { text?: string; links?: FooterLink[] };

export type LayoutData = {
  site?: SiteMeta;
  footer?: FooterData;
};

export async function getLayout(): Promise<LayoutData> {
  const file = path.join(process.cwd(), "content", "settings", "layout.json");
  try {
    const raw = await fs.readFile(file, "utf8");
    const data = JSON.parse(raw);

    const site: SiteMeta | undefined = data?.site
      ? {
          name: data.site.name ?? undefined,
          description: data.site.description ?? undefined,
          nav: Array.isArray(data.site.nav)
            ? data.site.nav
                .filter((n: any) => n?.label && n?.href)
                .map((n: any) => ({ label: String(n.label), href: String(n.href) }))
            : undefined,
        }
      : undefined;

    const footer: FooterData | undefined = data?.footer
      ? {
          text: data.footer.text ?? undefined,
          links: Array.isArray(data.footer.links)
            ? data.footer.links
                .filter((l: any) => l?.label && l?.href)
                .map((l: any) => ({ label: String(l.label), href: String(l.href) }))
            : undefined,
        }
      : undefined;

    return { site, footer };
  } catch {
    // si le fichier n’existe pas encore
    return {};
  }
}
