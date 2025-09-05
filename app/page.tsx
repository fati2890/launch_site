// app/page.tsx
import HomeBlocks from "@/components/blocks/home-blocks";
import { getPage } from "@/lib/page";

export default async function Home() {
  const page = await getPage("home"); 
  return <HomeBlocks page={page} />;  
}
