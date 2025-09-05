// components/layout/footer.tsx
import Link from "next/link";
import type { FooterLink } from "@/lib/layout";

export default function Footer({
  text,
  links,
}: {
  text?: string;
  links?: FooterLink[];
}) {
  return (
    <footer className="border-t bg-background/50">
      <div className="container py-8">
        {text ? <p className="text-sm text-muted-foreground">{text}</p> : null}
        {links?.length ? (
          <nav className="mt-4 flex flex-wrap gap-4 text-sm">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="hover:underline">
                {l.label}
              </Link>
            ))}
          </nav>
        ) : null}
      </div>
    </footer>
  );
}
