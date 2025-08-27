import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

export type Stat = { value: string | number; title: string; description?: string };

export async function getStats(): Promise<Stat[]> {
  const file = path.join(process.cwd(), "content", "stats", "stats.md");
  const raw = await fs.readFile(file, "utf8");
  const { data } = matter(raw);
  const items = Array.isArray((data as any).items) ? (data as any).items : [];
  return items.map((it: any) => ({
    value: it.value,
    title: String(it.title ?? ""),
    description: it.description ? String(it.description) : undefined,
  }));
}