import { SiteHeader } from "@/components/home/site-header";
import StatsSection from "@/components/home/stats-section";
import ValuesSection from "@/components/home/values-section";
import { ScrollingBanner } from "@/components/ui/scrolling-banner";
import Image from "next/image";
import impact from "@/public/Impact-of-work.png";
import HeroSection from "@/components/home/hero-section";
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
