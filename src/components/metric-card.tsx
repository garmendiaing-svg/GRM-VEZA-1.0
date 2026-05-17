import type { LucideIcon } from "lucide-react";

type MetricCardProps = {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone?: "teal" | "amber" | "sky" | "zinc";
};

const toneClass = {
  teal: "bg-teal-50 text-teal-700 ring-teal-100",
  amber: "bg-amber-50 text-amber-700 ring-amber-100",
  sky: "bg-sky-50 text-sky-700 ring-sky-100",
  zinc: "bg-zinc-100 text-zinc-700 ring-zinc-200"
};

export function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = "zinc"
}: MetricCardProps) {
  return (
    <article className="rounded-lg border border-zinc-200 bg-white p-5 shadow-panel">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-zinc-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-industrial-ink">{value}</p>
        </div>
        <span className={`rounded-md p-2 ring-1 ${toneClass[tone]}`}>
          <Icon aria-hidden="true" className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-4 text-sm text-zinc-500">{detail}</p>
    </article>
  );
}
