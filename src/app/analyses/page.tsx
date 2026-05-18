import { Gauge, ShieldCheck, Zap } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { ModuleHeader } from "@/components/module-header";
import { OpportunitySummary } from "@/components/opportunity-summary";
import { StatusPill } from "@/components/status-pill";
import { sampleBakeryAnalysis } from "@/domain/energy/sample-data";
import { formatCurrency } from "@/lib/format";
import { getRepositoryDashboardSnapshot } from "@/server/data/repository";

export default async function AnalysesPage() {
  const snapshot = await getRepositoryDashboardSnapshot();
  const analysis = snapshot.analyses[0] ?? sampleBakeryAnalysis;

  return (
    <AppShell>
      <ModuleHeader
        eyebrow="Motor tecnico"
        title="Analisis energetico"
        description="Reglas auditables para convertir cargos electricos en oportunidades economicas y recomendaciones tecnicas."
        icon={Gauge}
      />

      <div className="mt-6 space-y-6">
        <OpportunitySummary analysis={analysis} />

        <section className="grid gap-6 xl:grid-cols-[1fr_420px]">
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-panel">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase text-teal-700">
              <ShieldCheck className="h-4 w-4" />
              Trazabilidad
            </div>
            <div className="mt-4 space-y-3">
              {analysis.auditTrail.map((item) => (
                <div
                  key={item.rule}
                  className="rounded-lg border border-zinc-200 bg-zinc-50 p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-semibold text-industrial-ink">
                      {item.rule}
                    </p>
                    <StatusPill
                      tone={item.result === "triggered" ? "amber" : "zinc"}
                    >
                      {item.result}
                    </StatusPill>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    {item.rationale}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-panel">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase text-teal-700">
              <Zap className="h-4 w-4" />
              Recomendaciones
            </div>
            <div className="mt-4 space-y-3">
              {analysis.recommendations.map((recommendation) => (
                <div key={recommendation.code} className="rounded-lg border border-zinc-200 p-4">
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
              ))}
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
