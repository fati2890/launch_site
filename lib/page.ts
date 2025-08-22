import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

export type PageData = {
  title: string;
  description: string;
  heading?: string;
  subheading?: string;
  content: string;
};

export async function getHomePage(): Promise<PageData> {
  const file = path.join(process.cwd(), "content", "pages", "home.md");
  const raw = await fs.readFile(file, "utf8");
  const { data, content } = matter(raw);

  return {
    title: data.title ?? "",
    description: data.description ?? "",
    heading: data.heading ?? "",
    subheading: data.subheading ?? "",
    content,
  };
}
