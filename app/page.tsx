import { SiteHeader } from "@/components/layout/site-header";
import StatsSection from "@/components/layout/stats-section";
import ValuesSection from "@/components/layout/values-section";
import { ScrollingBanner } from "@/components/ui/scrolling-banner";
import Image from "next/image";
import impact from "@/public/Impact-of-work.png";
import HeroSection from "@/components/layout/hero-section";
export default function Home() {
  return (
    <div>
      
      <SiteHeader/>
      
      <main>
        <HeroSection/>
        <ValuesSection/>
        <ScrollingBanner
              src={impact}
              height={92}
              gapPx={80}
              speedSeconds={24}
              count={8}
            />       
        <StatsSection/>
      </main>
    </div>
   

  );
}
