// components/layout/site-header.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

type SiteNav = { label: string; href: string };
type SiteMeta = { name?: string; description?: string; nav?: SiteNav[] };

export default function SiteHeader({ site }: { site?: SiteMeta }) {
  const nav = Array.isArray(site?.nav) ? site!.nav : [];
  const hasNav = nav.length > 0;
  const last = hasNav ? nav[nav.length - 1] : null;
  const rest = hasNav ? nav.slice(0, -1) : [];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="text-2xl font-semibold text-primary">
          {site?.name ?? "Site"}
        </Link>
        <nav className="flex items-center gap-2">
          {rest.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm hover:underline"
            >
              {item.label}
            </Link>
          ))}
          {last ? (
            <Button asChild variant="ghost">
              <Link href={last.href}>{last.label}</Link>
            </Button>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
