import { BookOpen, Layers, Users2 } from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";

export default function StatsStrip({ articles, authors, categories }) {
  const stats = [
    { icon: BookOpen, label: "Articles", value: articles },
    { icon: Users2, label: "Authors", value: authors },
    { icon: Layers, label: "Categories", value: categories },
  ];

  return (
    <div className="grid grid-cols-3 gap-6 rounded-2xl border border-slate-200/70 bg-surface-card p-8 shadow-sm dark:border-slate-800 dark:bg-surface-dark-card">
      {stats.map(({ icon: Icon, label, value }) => (
        <div key={label} className="flex flex-col items-center text-center">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
            <Icon className="h-5 w-5" />
          </div>
          <p className="font-heading text-3xl font-extrabold text-ink-primary dark:text-ink-invert">
            <AnimatedCounter target={value} suffix="+" />
          </p>
          <p className="mt-1 text-sm text-ink-secondary dark:text-slate-400">{label}</p>
        </div>
      ))}
    </div>
  );
}
