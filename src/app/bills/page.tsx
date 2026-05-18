import Link from "next/link";
import { FileText, Plus, ReceiptText } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { ModuleHeader } from "@/components/module-header";
import { StatusPill } from "@/components/status-pill";
import { formatCurrency, formatNumber } from "@/lib/format";
import { getDashboardSnapshot } from "@/server/data/store";

export default function BillsPage() {
  const snapshot = getDashboardSnapshot();

  return (
    <AppShell>
      <ModuleHeader
        eyebrow="Modulo de boletas"
        title="Boletas electricas"
        description="Carga PDFs, fotos o datos manuales para extraer cargos, detectar problemas y disparar diagnosticos."
        icon={ReceiptText}
        action={
          <Link
            href="/bills/new"
            className="focus-ring inline-flex items-center gap-2 rounded-md bg-industrial-ink px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
          >
            <Plus className="h-4 w-4" />
            Nueva boleta
          </Link>
        }
      />

      <section className="mt-6 rounded-lg border border-zinc-200 bg-white p-6 shadow-panel">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-industrial-ink">
            Boletas registradas
          </h2>
          <StatusPill tone="teal">{snapshot.bills.length} boleta</StatusPill>
        </div>

        <div className="mt-5 overflow-hidden rounded-lg border border-zinc-200">
          <div className="grid grid-cols-5 bg-zinc-50 px-4 py-3 text-xs font-semibold uppercase text-zinc-500">
            <span>Distribuidora</span>
            <span>Mes</span>
            <span>Total</span>
            <span>kWh</span>
            <span>Estado</span>
          </div>
          {snapshot.bills.map((bill) => (
            <div
              key={bill.id}
              className="grid grid-cols-5 items-center border-t border-zinc-200 px-4 py-4 text-sm"
            >
              <span className="flex items-center gap-2 font-medium text-industrial-ink">
                <FileText className="h-4 w-4 text-teal-700" />
                {bill.distributor ?? "Pendiente"}
              </span>
              <span className="text-zinc-600">{bill.billingMonth ?? "-"}</span>
              <span className="font-semibold text-industrial-ink">
                {formatCurrency(bill.totalAmountClp)}
              </span>
              <span className="text-zinc-600">
                {formatNumber(bill.energyKwh)} kWh
              </span>
              <span>
                <StatusPill tone="amber">Diagnosticada</StatusPill>
              </span>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
