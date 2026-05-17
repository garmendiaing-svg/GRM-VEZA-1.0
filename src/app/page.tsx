import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Building2,
  CalendarClock,
  CreditCard,
  FileText,
  Gauge,
  PanelTop,
  ShieldCheck,
  TrendingDown,
  Zap
} from "lucide-react";

import { BillAnalysisForm } from "@/components/bill-analysis-form";
import { MetricCard } from "@/components/metric-card";
import { OpportunitySummary } from "@/components/opportunity-summary";
import { sampleBakeryAnalysis } from "@/domain/energy/sample-data";
import { createCommercialProposal } from "@/domain/finance/create-proposal";
import { formatCurrency, formatPercent } from "@/lib/format";

const proposal = createCommercialProposal({ analysis: sampleBakeryAnalysis });

const navItems = [
  { label: "Dashboard", icon: BarChart3 },
  { label: "Clientes", icon: Building2 },
  { label: "Boletas", icon: FileText },
  { label: "Análisis", icon: Gauge },
  { label: "Propuestas", icon: CreditCard },
  { label: "Admin", icon: PanelTop }
];

const pipeline = [
  {
    name: "Diagnóstico",
    value: "6",
    detail: "Sitios con boleta cargada",
    icon: FileText,
    tone: "sky" as const
  },
  {
    name: "Propuesta",
    value: "3",
    detail: "Casos listos para visita",
    icon: CreditCard,
    tone: "amber" as const
  },
  {
    name: "Monitoreo",
    value: "2",
    detail: "Clientes con seguimiento",
    icon: CalendarClock,
    tone: "teal" as const
  }
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto grid w-full max-w-[1440px] lg:grid-cols-[260px_1fr]">
        <aside className="border-b border-zinc-200 bg-white px-5 py-5 lg:min-h-screen lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-industrial-ink text-white">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-industrial-ink">
                ElectroFit
              </p>
              <p className="text-xs text-zinc-500">SaaS/ESCO Chile</p>
            </div>
          </div>
          <nav className="mt-8 grid gap-1 text-sm">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
              <a
                key={item.label}
                className="flex items-center gap-3 rounded-md px-3 py-2 font-medium text-zinc-600 hover:bg-zinc-50 hover:text-industrial-ink"
                href="#"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </a>
              );
            })}
          </nav>
          <div className="mt-8 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-industrial-ink">
              <ShieldCheck className="h-4 w-4 text-teal-700" />
              Regla MVP
            </div>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              Ahorro preliminar sujeto a medición, visita técnica y linea base.
            </p>
          </div>
        </aside>

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <header className="flex flex-col gap-4 border-b border-zinc-200 pb-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase text-teal-700">
                Operación comercial
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-industrial-ink">
                Optimización de costos eléctricos
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600">
                Diagnóstico automático para panaderías, minimarkets, restaurantes
                y pequeñas industrias.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/bills/new"
                className="focus-ring inline-flex items-center gap-2 rounded-md bg-industrial-ink px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
              >
                <FileText className="h-4 w-4" />
                Nueva boleta
              </Link>
              <Link
                href="/reports"
                className="focus-ring inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
              >
                Informe
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </header>

          <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Ahorro mensual"
              value={formatCurrency(sampleBakeryAnalysis.estimatedSavingsClp)}
              detail={`${formatPercent(sampleBakeryAnalysis.estimatedSavingsPercent)} del caso base CGE`}
              icon={TrendingDown}
              tone="teal"
            />
            <MetricCard
              label="Ahorro anual"
              value={formatCurrency(sampleBakeryAnalysis.annualSavingsClp)}
              detail="Estimación antes de medición"
              icon={BarChart3}
              tone="sky"
            />
            <MetricCard
              label="Score oportunidad"
              value={`${sampleBakeryAnalysis.opportunityScore}/100`}
              detail="Potencia y reactivos activados"
              icon={Gauge}
              tone="amber"
            />
            <MetricCard
              label="Propuesta inicial"
              value={formatCurrency(proposal.implementationCostClp)}
              detail={`${formatCurrency(proposal.upfrontPaymentClp)} anticipo sugerido`}
              icon={CreditCard}
              tone="zinc"
            />
          </section>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
            <div className="space-y-6">
              <OpportunitySummary analysis={sampleBakeryAnalysis} />
              <BillAnalysisForm />
            </div>
            <div className="space-y-6">
              <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-panel">
                <p className="text-sm font-semibold uppercase text-teal-700">
                  Embudo MVP
                </p>
                <div className="mt-4 space-y-3">
                  {pipeline.map((item) => {
                    const PipelineIcon = item.icon;

                    return (
                      <div
                        key={item.name}
                        className="flex items-center justify-between gap-3 rounded-lg border border-zinc-200 p-4"
                      >
                        <div className="flex items-center gap-3">
                          <span className="rounded-md bg-zinc-100 p-2 text-zinc-700">
                            <PipelineIcon className="h-4 w-4" />
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-industrial-ink">
                              {item.name}
                            </p>
                            <p className="text-xs text-zinc-500">{item.detail}</p>
                          </div>
                        </div>
                        <span className="text-lg font-semibold text-industrial-ink">
                          {item.value}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-panel">
                <p className="text-sm font-semibold uppercase text-teal-700">
                  Próximo paso
                </p>
                <h2 className="mt-2 text-xl font-semibold text-industrial-ink">
                  Visita técnica y medición corta
                </h2>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  Priorizar tablero, cargas térmicas, motores, refrigeración y
                  factor de potencia antes de cerrar una promesa comercial.
                </p>
                <div className="mt-4 rounded-lg bg-zinc-50 p-4">
                  <p className="text-sm font-medium text-zinc-700">
                    Ahorro compartido sugerido
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-industrial-ink">
                    {formatCurrency(proposal.monthlySharedSavingsClp)}
                  </p>
                  <p className="mt-1 text-sm text-zinc-500">
                    {formatPercent(proposal.sharedSavingsRate)} del ahorro mensual
                  </p>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
