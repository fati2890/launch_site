import { StatItem } from "@/components/ui/Stat-item";
import { getStats } from "@/lib/stats";

export default async function StatsSection() {
  const items = await getStats();

  return (
    
  <section className="py-12">
  <div className="max-w-3xl mx-auto">
    <div className="grid gap-10 sm:grid-cols-2">
      {items.slice(0, 4).map((s, i) => (
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
