import Link from "next/link";
import { ArrowLeft, FileText, ShieldCheck } from "lucide-react";

import { BillAnalysisForm } from "@/components/bill-analysis-form";

export default function NewBillPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 border-b border-zinc-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-industrial-ink"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
          <h1 className="mt-4 text-3xl font-semibold text-industrial-ink">
            Ingreso de boleta eléctrica
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600">
            Registro manual compatible con OCR posterior, fotos de tablero y
            seguimiento mensual.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-600">
          <ShieldCheck className="h-4 w-4 text-teal-700" />
          Cálculo auditable
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <BillAnalysisForm />
        <aside className="space-y-4">
          {[
            "Boleta PDF o imagen",
            "Fotos de tablero",
            "Listado de cargas",
            "Horario operativo",
            "Medición si hay reactivos"
          ].map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-4 shadow-panel"
            >
              <FileText className="h-4 w-4 text-teal-700" />
              <span className="text-sm font-medium text-zinc-700">{item}</span>
            </div>
          ))}
        </aside>
      </div>
    </main>
  );
}
