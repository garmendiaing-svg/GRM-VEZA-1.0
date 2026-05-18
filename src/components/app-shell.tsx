import Link from "next/link";
import type { ReactNode } from "react";
import {
  BarChart3,
  Building2,
  CreditCard,
  FileText,
  Gauge,
  PanelTop,
  ShieldCheck,
  Zap
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/", icon: BarChart3 },
  { label: "Clientes", href: "/clients", icon: Building2 },
  { label: "Boletas", href: "/bills", icon: FileText },
  { label: "Analisis", href: "/analyses", icon: Gauge },
  { label: "Proyectos", href: "/projects", icon: Zap },
  { label: "Propuestas", href: "/proposals", icon: CreditCard },
  { label: "Admin", href: "/admin", icon: PanelTop }
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <div className="mx-auto grid w-full max-w-[1440px] lg:grid-cols-[260px_1fr]">
        <aside className="border-b border-zinc-200 bg-white px-5 py-5 lg:min-h-screen lg:border-b-0 lg:border-r">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-industrial-ink text-white">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-industrial-ink">
                ElectroFit
              </p>
              <p className="text-xs text-zinc-500">SaaS/ESCO Chile</p>
            </div>
          </Link>

          <nav className="mt-8 grid gap-1 text-sm">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  className="flex items-center gap-3 rounded-md px-3 py-2 font-medium text-zinc-600 hover:bg-zinc-50 hover:text-industrial-ink"
                  href={item.href}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-industrial-ink">
              <ShieldCheck className="h-4 w-4 text-teal-700" />
              Regla MVP
            </div>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              Ahorro preliminar sujeto a medicion, visita tecnica y linea base.
            </p>
          </div>
        </aside>

        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
