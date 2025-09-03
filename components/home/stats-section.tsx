import { StatItem } from "@/components/ui/Stat-item";

export default function StatsSection({ items }: { items: { value: string | number; title: string; description?: string }[] }) {
  return (
    <section className="py-12">
      <div className="max-w-3xl mx-auto">
        <div className="grid gap-10 sm:grid-cols-2">
          {items.map((s, i) => (
            <StatItem
              key={`${s.title}-${i}`}
              value={s.value}
              title={s.title}
              description={s.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
