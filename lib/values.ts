import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

export type ValueItemData = { title: string; description: string };

export async function getValues(): Promise<ValueItemData[]> {
  const file = path.join(process.cwd(), "content", "values", "valuesection.md");
  const raw = await fs.readFile(file, "utf8");
  const { data } = matter(raw);

  const values = Array.isArray((data as any).values) ? (data as any).values : [];
  // guard: ne garder que les champs attendus
  return values.map((v: any) => ({
    title: String(v.title ?? ""),
    description: String(v.description ?? "")
  }));
}
