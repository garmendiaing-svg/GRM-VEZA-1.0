import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CalendarClock,
  CreditCard,
  FileText,
  Gauge,
  TrendingDown
} from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { BillAnalysisForm } from "@/components/bill-analysis-form";
import { MetricCard } from "@/components/metric-card";
import { ModuleHeader } from "@/components/module-header";
import { OpportunitySummary } from "@/components/opportunity-summary";
import { sampleBakeryAnalysis } from "@/domain/energy/sample-data";
import { createCommercialProposal } from "@/domain/finance/create-proposal";
import { formatCurrency, formatPercent } from "@/lib/format";

const proposal = createCommercialProposal({ analysis: sampleBakeryAnalysis });

const pipeline = [
  {
    name: "Diagnostico",
    value: "6",
    detail: "Sitios con boleta cargada",
    icon: FileText
  },
  {
    name: "Propuesta",
    value: "3",
    detail: "Casos listos para visita",
    icon: CreditCard
  },
  {
    name: "Monitoreo",
    value: "2",
    detail: "Clientes con seguimiento",
    icon: CalendarClock
  }
];

export default function HomePage() {
  return (
    <AppShell>
      <ModuleHeader
        eyebrow="Operacion comercial"
        title="Optimizacion de costos electricos"
        description="Diagnostico automatico para panaderias, minimarkets, restaurantes y pequenas industrias."
        icon={BarChart3}
        action={
          <>
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
          </>
        }
      />

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
          detail="Estimacion antes de medicion"
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
                const Icon = item.icon;

                return (
                  <div
                    key={item.name}
                    className="flex items-center justify-between gap-3 rounded-lg border border-zinc-200 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="rounded-md bg-zinc-100 p-2 text-zinc-700">
                        <Icon className="h-4 w-4" />
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
              Proximo paso
            </p>
            <h2 className="mt-2 text-xl font-semibold text-industrial-ink">
              Visita tecnica y medicion corta
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              Priorizar tablero, cargas termicas, motores, refrigeracion y factor
              de potencia antes de cerrar una promesa comercial.
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
    </AppShell>
  );
}
