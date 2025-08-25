import { ValueItem } from "@/components/ui/value-item";
import { getValues } from "@/lib/values";

export default async function ValuesSection() {
  const items = await getValues();

  return (
    <section className="max-w-xl mx-auto">
      {items.slice(0, 3).map((it, i) => (
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
