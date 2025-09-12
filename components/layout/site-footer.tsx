// components/layout/site-footer.tsx
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { SiteMeta } from "@/lib/page-types"; // ou "@/lib/page" selon où tu exportes

export type FooterLink = { label: string; href: string };

type SiteFooterProps = {
  site?: SiteMeta;                 // ✅ nouveau
  text?: string;
  links?: FooterLink[];
  className?: string;
};

export default function SiteFooter({ site, text, links, className }: SiteFooterProps) {
  const finalLinks: FooterLink[] =
    links ??
    (Array.isArray(site?.nav)
      ? site!.nav.map((n) => ({ label: n.label, href: n.href }))
      : []);

  return (
    <footer className={cn("border-t bg-background/50", className)}>
      <div className="container py-8 text-sm text-muted-foreground flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <p>
          {text ?? `© ${new Date().getFullYear()} ${site?.name ?? "Keiken"}. All rights reserved.`}
        </p>
        <nav className="flex flex-wrap gap-4">
          {finalLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="hover:text-foreground underline-offset-4 hover:underline"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
