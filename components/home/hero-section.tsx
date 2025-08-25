import { getHomePage } from "@/lib/page";

export default async function HeroSection() {
  const home = await getHomePage();

  return (
    <section className="text-center py-16">
      <h1 className="text-5xl md:text-6xl font-bold text-sky-500">
        {home.heading}
      </h1>
      <h2 className="mt-4 text-xl md:text-2xl text-muted-foreground">
        {home.subheading}
      </h2>
    </section>
  );
}
