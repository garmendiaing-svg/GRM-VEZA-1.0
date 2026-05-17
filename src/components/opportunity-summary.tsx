import { AlertTriangle, CheckCircle2, Gauge, TrendingDown } from "lucide-react";

import type { EnergyAnalysisResult } from "@/domain/energy/analyze-electric-bill";
import { formatCurrency, formatPercent } from "@/lib/format";

type OpportunitySummaryProps = {
  analysis: EnergyAnalysisResult;
};

function Bar({ label, value }: { label: string; value: number | null }) {
  const normalized = Math.min(Math.max((value ?? 0) * 100, 0), 100);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-zinc-700">{label}</span>
        <span className="text-zinc-500">{formatPercent(value)}</span>
      </div>
      <div className="h-2 rounded-full bg-zinc-100">
        <div
          className="h-2 rounded-full bg-teal-600"
          style={{ width: `${normalized}%` }}
        />
      </div>
    </div>
  );
}

export function OpportunitySummary({ analysis }: OpportunitySummaryProps) {
  const issues = [
    { label: "Potencia", active: analysis.powerIssue },
    { label: "Reactivos", active: analysis.reactiveIssue },
    { label: "Consumo", active: analysis.consumptionIssue },
    { label: "Calidad", active: analysis.qualityIssue }
  ];

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-panel">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-teal-700">
            Diagnóstico preliminar
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-industrial-ink">
            {formatCurrency(analysis.estimatedSavingsClp)} de ahorro mensual estimado
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
            {analysis.commercialSummary}
          </p>
        </div>
        <div className="grid min-w-56 grid-cols-2 gap-3">
          <div className="rounded-lg border border-zinc-200 p-4">
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <TrendingDown className="h-4 w-4 text-teal-700" />
              Ahorro
            </div>
            <p className="mt-2 text-xl font-semibold text-industrial-ink">
              {formatPercent(analysis.estimatedSavingsPercent)}
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 p-4">
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <Gauge className="h-4 w-4 text-amber-700" />
              Score
            </div>
            <p className="mt-2 text-xl font-semibold text-industrial-ink">
              {analysis.opportunityScore}/100
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_0.9fr]">
        <div className="space-y-4">
          <Bar label="Energía" value={analysis.energyPercent} />
          <Bar label="Potencia y demanda" value={analysis.powerPercent} />
          <Bar label="Energía reactiva" value={analysis.reactivePercent} />
          <Bar label="Otros cargos" value={analysis.otherChargesPercent} />
        </div>
        <div className="rounded-lg bg-zinc-50 p-4">
          <p className="text-sm font-semibold text-industrial-ink">
            Alertas técnicas
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {issues.map((issue) => (
              <div
                key={issue.label}
                className="flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm"
              >
                {issue.active ? (
                  <AlertTriangle className="h-4 w-4 text-amber-700" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 text-teal-700" />
                )}
                <span className="text-zinc-700">{issue.label}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm leading-6 text-zinc-600">
            {analysis.technicalSummary}
          </p>
        </div>
      </div>
    </section>
  );
}
