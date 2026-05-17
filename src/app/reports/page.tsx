import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShieldCheck } from "lucide-react";

import { PrintReportButton } from "@/components/print-report-button";
import { sampleBakeryAnalysis } from "@/domain/energy/sample-data";
import { createCommercialProposal } from "@/domain/finance/create-proposal";
import { formatCurrency, formatPercent } from "@/lib/format";

const proposal = createCommercialProposal({ analysis: sampleBakeryAnalysis });

export default function ReportsPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 border-b border-zinc-200 pb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-industrial-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Link>
        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-teal-700">
              Informe preliminar
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-industrial-ink">
              Panadería Centro - Boleta CGE
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600">
              Diagnóstico comercial para validación técnica, propuesta ESCO y
              seguimiento mensual.
            </p>
          </div>
          <PrintReportButton />
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-panel">
          <p className="text-sm text-zinc-500">Ahorro mensual</p>
          <p className="mt-2 text-2xl font-semibold text-industrial-ink">
            {formatCurrency(sampleBakeryAnalysis.estimatedSavingsClp)}
          </p>
          <p className="mt-1 text-sm text-teal-700">
            {formatPercent(sampleBakeryAnalysis.estimatedSavingsPercent)}
          </p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-panel">
          <p className="text-sm text-zinc-500">Ahorro anual</p>
          <p className="mt-2 text-2xl font-semibold text-industrial-ink">
            {formatCurrency(sampleBakeryAnalysis.annualSavingsClp)}
          </p>
          <p className="mt-1 text-sm text-zinc-500">Estimación preliminar</p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-panel">
          <p className="text-sm text-zinc-500">Inversión referencial</p>
          <p className="mt-2 text-2xl font-semibold text-industrial-ink">
            {formatCurrency(proposal.implementationCostClp)}
          </p>
          <p className="mt-1 text-sm text-zinc-500">
            Payback {proposal.estimatedPaybackMonths} meses
          </p>
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-zinc-200 bg-white p-6 shadow-panel">
        <div className="flex items-center gap-2 text-sm font-semibold uppercase text-teal-700">
          <ShieldCheck className="h-4 w-4" />
          Hallazgos
        </div>
        <p className="mt-3 text-sm leading-6 text-zinc-700">
          {sampleBakeryAnalysis.technicalSummary}
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {sampleBakeryAnalysis.recommendations.map((recommendation) => (
            <div
              key={recommendation.code}
              className="rounded-lg border border-zinc-200 p-4"
            >
              <div className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
                <div>
                  <p className="text-sm font-semibold text-industrial-ink">
                    {recommendation.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    {recommendation.description}
                  </p>
                  {recommendation.estimatedImpactClp ? (
                    <p className="mt-3 text-sm font-semibold text-teal-700">
                      Impacto: {formatCurrency(recommendation.estimatedImpactClp)}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-zinc-200 bg-white p-6 shadow-panel">
        <p className="text-sm font-semibold uppercase text-teal-700">
          Propuesta comercial
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-zinc-50 p-5">
            <p className="text-sm text-zinc-500">Anticipo sugerido</p>
            <p className="mt-2 text-2xl font-semibold text-industrial-ink">
              {formatCurrency(proposal.upfrontPaymentClp)}
            </p>
          </div>
          <div className="rounded-lg bg-zinc-50 p-5">
            <p className="text-sm text-zinc-500">Monitoreo mensual</p>
            <p className="mt-2 text-2xl font-semibold text-industrial-ink">
              {formatCurrency(proposal.suggestedMonitoringFeeClp)}
            </p>
          </div>
        </div>
        <ul className="mt-5 space-y-2 text-sm leading-6 text-zinc-600">
          {proposal.notes.map((note) => (
            <li key={note} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-700" />
              {note}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
