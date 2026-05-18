import type { ReactNode } from "react";

type StatusPillProps = {
  children: ReactNode;
  tone?: "teal" | "amber" | "zinc";
};

const toneClass = {
  teal: "bg-teal-50 text-teal-700 ring-teal-100",
  amber: "bg-amber-50 text-amber-700 ring-amber-100",
  zinc: "bg-zinc-100 text-zinc-700 ring-zinc-200"
};

export function StatusPill({ children, tone = "zinc" }: StatusPillProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${toneClass[tone]}`}
    >
      {children}
    </span>
  );
}
