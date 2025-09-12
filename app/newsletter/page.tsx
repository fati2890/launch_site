// app/newsletter/page.tsx
import { getPage } from "@/lib/page";
import HomeBlocks from "@/components/blocks/home-blocks";
import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";
import { getLayout } from "@/lib/layout";


export default async function NewsletterPage() {
     const { site, footer } = await getLayout();
  
const page = await getPage("newsletter");

      <main>
        <HomeBlocks page={page} />
      </main>

}
