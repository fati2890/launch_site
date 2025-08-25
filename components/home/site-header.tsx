import Link from "next/link";
import site from "../../content/setting/site.json";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const nav = Array.isArray((site as any).nav) ? (site as any).nav : [];
  const hasNav = nav.length > 0;
  const last = hasNav ? nav[nav.length - 1] : null;
  const rest = hasNav ? nav.slice(0, -1) : [];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className=" text-2xl font-semibold text-sky-800">
          {(site as any).name ?? "Site"}
        </Link>
        <nav className="flex items-center gap-2">
          {rest.map((item: any) => (
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
