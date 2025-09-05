// components/home/hero-section.tsx
type HeroProps = {
  heading: string;
  subheading?: string;
  align?: "left" | "center" | "right";
};

export default function HeroSection({ heading, subheading, align = "center" }: HeroProps) {
  const alignClass =
    align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left";

  return (
    <section className={`py-16 ${alignClass}`}>
      <h1 className="text-5xl md:text-6xl font-bold text-sky-500">{heading}</h1>
      {subheading ? (
        <h2 className="mt-4 text-xl md:text-2xl text-muted-foreground">{subheading}</h2>
      ) : null}
    </section>
  );
}
