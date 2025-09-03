import { ValueItem } from "@/components/ui/value-item";

export default function ValuesSection({ values }: { values: { title: string; description: string }[] }) {
  return (
    <section className="max-w-xl mx-auto">
      {values.map((it, i) => (
        <ValueItem
          key={`${it.title}-${i}`}
          index={i + 1}
          title={it.title}
          description={it.description}
        />
      ))}
    </section>
  );
}
