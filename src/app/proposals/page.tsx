import { CreditCard, FileText, Percent } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { MetricCard } from "@/components/metric-card";
import { ModuleHeader } from "@/components/module-header";
import { StatusPill } from "@/components/status-pill";
import { sampleBakeryAnalysis } from "@/domain/energy/sample-data";
import { createCommercialProposal } from "@/domain/finance/create-proposal";
import { formatCurrency, formatPercent } from "@/lib/format";

const proposal = createCommercialProposal({ analysis: sampleBakeryAnalysis });

export default function ProposalsPage() {
  return (
    <AppShell>
      <ModuleHeader
        eyebrow="Modulo financiero"
        title="Propuestas comerciales"
        description="Simula anticipo, ahorro compartido, monitoreo y payback antes de enviar una oferta formal."
        icon={CreditCard}
      />

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Inversion referencial"
          value={formatCurrency(proposal.implementationCostClp)}
          detail="Monto preliminar para implementacion"
          icon={CreditCard}
          tone="zinc"
        />
        <MetricCard
          label="Anticipo"
          value={formatCurrency(proposal.upfrontPaymentClp)}
          detail="35% sugerido para iniciar"
          icon={Percent}
          tone="amber"
        />
        <MetricCard
          label="Ahorro compartido"
          value={formatCurrency(proposal.monthlySharedSavingsClp)}
          detail={`${formatPercent(proposal.sharedSavingsRate)} del ahorro mensual`}
          icon={FileText}
          tone="teal"
        />
        <MetricCard
          label="Monitoreo"
          value={formatCurrency(proposal.suggestedMonitoringFeeClp)}
          detail="Suscripcion mensual sugerida"
          icon={CreditCard}
          tone="sky"
        />
      </section>

      <section className="mt-6 rounded-lg border border-zinc-200 bg-white p-6 shadow-panel">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase text-teal-700">
              Borrador comercial
            </p>
            <h2 className="mt-2 text-xl font-semibold text-industrial-ink">
              {proposal.title}
            </h2>
          </div>
          <StatusPill tone="amber">Draft</StatusPill>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-zinc-50 p-5">
            <p className="text-sm text-zinc-500">Ahorro anual estimado</p>
            <p className="mt-2 text-2xl font-semibold text-industrial-ink">
              {formatCurrency(proposal.annualEstimatedSavingsClp)}
            </p>
          </div>
          <div className="rounded-lg bg-zinc-50 p-5">
            <p className="text-sm text-zinc-500">Monto financiado</p>
            <p className="mt-2 text-2xl font-semibold text-industrial-ink">
              {formatCurrency(proposal.financedAmountClp)}
            </p>
          </div>
          <div className="rounded-lg bg-zinc-50 p-5">
            <p className="text-sm text-zinc-500">Payback</p>
            <p className="mt-2 text-2xl font-semibold text-industrial-ink">
              {proposal.estimatedPaybackMonths} meses
            </p>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
