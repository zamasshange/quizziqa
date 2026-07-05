import { formatNumber } from "@/lib/utils";
import { siteStats } from "@/lib/data/stats";

const stats = [
  { label: "Games", value: siteStats.gamesAvailable, emoji: "🎮" },
  { label: "Players", value: siteStats.players, emoji: "👥", format: true },
  { label: "Categories", value: siteStats.categories, emoji: "📂" },
  {
    label: "Completed",
    value: siteStats.challengesCompleted,
    emoji: "✅",
    format: true,
  },
];

export function StatsBar() {
  return (
    <section className="px-4 pb-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map(({ label, value, emoji, format }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-1 rounded-2xl bg-card border border-border p-4 text-center"
          >
            <span className="text-2xl">{emoji}</span>
            <span className="text-xl sm:text-2xl font-extrabold">
              {format ? formatNumber(value) : value}
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              {label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
