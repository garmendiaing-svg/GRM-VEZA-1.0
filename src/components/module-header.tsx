import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type ModuleHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  action?: ReactNode;
};

export function ModuleHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
  action
}: ModuleHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-zinc-200 pb-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex gap-4">
        <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-industrial-ink text-white">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase text-teal-700">
            {eyebrow}
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-industrial-ink">
            {title}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600">
            {description}
          </p>
        </div>
      </div>
      {action ? <div className="flex flex-wrap gap-2">{action}</div> : null}
    </header>
  );
}
