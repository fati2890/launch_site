import HomeBlocks from "@/components/blocks/home-blocks";
import { getPage } from "@/lib/page";

export default async function newsletterPage() {
  const page = await getPage("newsletter"); 
  return <HomeBlocks page={page} />;
}
