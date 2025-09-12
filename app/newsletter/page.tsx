// app/newsletter/page.tsx
import { getPage } from "@/lib/page";
import HomeBlocks from "@/components/blocks/home-blocks";


export default async function NewsletterPage() {
  
const page = await getPage("newsletter");

      <main>
        <HomeBlocks page={page} />
      </main>

}
