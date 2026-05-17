"use client";

import { useState } from "react";
import {
  Calculator,
  CheckCircle2,
  FileText,
  Gauge,
  Loader2,
  Save,
  UploadCloud,
  Zap
} from "lucide-react";

import {
  analyzeElectricBill,
  type EnergyAnalysisResult
} from "@/domain/energy/analyze-electric-bill";
import { formatCurrency, formatPercent } from "@/lib/format";

type FormState = {
  siteId: string;
  distributor: string;
  billingMonth: string;
  totalAmountClp: string;
  energyKwh: string;
  energyCostClp: string;
  powerChargeClp: string;
  reactivePenaltyClp: string;
  otherChargesClp: string;
};

const initialState: FormState = {
  siteId: "site_demo",
  distributor: "CGE",
  billingMonth: "2026-04",
  totalAmountClp: "859812",
  energyKwh: "4620",
  energyCostClp: "347581",
  powerChargeClp: "310562",
  reactivePenaltyClp: "92140",
  otherChargesClp: "109529"
};

function toNumber(value: string): number | undefined {
  const normalized = value.replace(/\./g, "").replace(",", ".");
  const number = Number(normalized);

  return Number.isFinite(number) ? number : undefined;
}

function Field({
  label,
  value,
  onChange,
  suffix,
  required = false
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  suffix?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-zinc-700">{label}</span>
      <div className="mt-2 flex overflow-hidden rounded-md border border-zinc-200 bg-white focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-100">
        <input
          className="min-w-0 flex-1 px-3 py-2.5 text-sm text-industrial-ink outline-none"
          inputMode="decimal"
          required={required}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        {suffix ? (
          <span className="border-l border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-500">
            {suffix}
          </span>
        ) : null}
      </div>
    </label>
  );
}

export function BillAnalysisForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [analysis, setAnalysis] = useState<EnergyAnalysisResult | null>(() =>
    analyzeElectricBill({
      totalAmountClp: Number(initialState.totalAmountClp),
      energyKwh: Number(initialState.energyKwh),
      energyCostClp: Number(initialState.energyCostClp),
      powerChargeClp: Number(initialState.powerChargeClp),
      reactivePenaltyClp: Number(initialState.reactivePenaltyClp),
      otherChargesClp: Number(initialState.otherChargesClp),
      distributor: initialState.distributor
    })
  );
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setStatus("idle");
  }

  function buildPayload() {
    return {
      siteId: form.siteId,
      distributor: form.distributor || undefined,
      billingMonth: form.billingMonth || undefined,
      totalAmountClp: toNumber(form.totalAmountClp) ?? 0,
      energyKwh: toNumber(form.energyKwh),
      energyCostClp: toNumber(form.energyCostClp),
      powerChargeClp: toNumber(form.powerChargeClp),
      reactivePenaltyClp: toNumber(form.reactivePenaltyClp),
      otherChargesClp: toNumber(form.otherChargesClp)
    };
  }

  function calculate() {
    const payload = buildPayload();

    try {
      setAnalysis(analyzeElectricBill(payload));
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  async function saveBill() {
    setStatus("saving");

    try {
      const response = await fetch("/api/bills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(buildPayload())
      });

      if (!response.ok) {
        throw new Error("Could not save bill");
      }

      const data = (await response.json()) as { analysis: EnergyAnalysisResult };
      setAnalysis(data.analysis);
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-panel">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-teal-700">
            Ingreso manual
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-industrial-ink">
            Boleta eléctrica
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
            Cargos principales, OCR pendiente y diagnóstico preliminar separado de
            ingeniería.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <label
            className="focus-ring inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            <input
              className="sr-only"
              type="file"
              accept=".pdf,image/*"
              onChange={(event) =>
                setSelectedFile(event.target.files?.[0]?.name ?? null)
              }
            />
            <UploadCloud className="h-4 w-4" />
            {selectedFile ?? "Adjuntar PDF"}
          </label>
          <button
            type="button"
            onClick={calculate}
            className="focus-ring inline-flex items-center gap-2 rounded-md bg-industrial-ink px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
          >
            <Calculator className="h-4 w-4" />
            Calcular
          </button>
          <button
            type="button"
            onClick={saveBill}
            disabled={status === "saving"}
            className="focus-ring inline-flex items-center gap-2 rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {status === "saving" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Guardar
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Field
          label="Total boleta"
          required
          suffix="CLP"
          value={form.totalAmountClp}
          onChange={(value) => updateField("totalAmountClp", value)}
        />
        <Field
          label="Consumo energía"
          suffix="CLP"
          value={form.energyCostClp}
          onChange={(value) => updateField("energyCostClp", value)}
        />
        <Field
          label="Cargo potencia"
          suffix="CLP"
          value={form.powerChargeClp}
          onChange={(value) => updateField("powerChargeClp", value)}
        />
        <Field
          label="Multa reactiva"
          suffix="CLP"
          value={form.reactivePenaltyClp}
          onChange={(value) => updateField("reactivePenaltyClp", value)}
        />
        <Field
          label="Otros cargos"
          suffix="CLP"
          value={form.otherChargesClp}
          onChange={(value) => updateField("otherChargesClp", value)}
        />
        <Field
          label="Energía medida"
          suffix="kWh"
          value={form.energyKwh}
          onChange={(value) => updateField("energyKwh", value)}
        />
        <label className="block">
          <span className="text-sm font-medium text-zinc-700">Distribuidora</span>
          <input
            className="focus-ring mt-2 w-full rounded-md border border-zinc-200 bg-white px-3 py-2.5 text-sm text-industrial-ink"
            value={form.distributor}
            onChange={(event) => updateField("distributor", event.target.value)}
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-zinc-700">Mes facturado</span>
          <input
            className="focus-ring mt-2 w-full rounded-md border border-zinc-200 bg-white px-3 py-2.5 text-sm text-industrial-ink"
            value={form.billingMonth}
            onChange={(event) => updateField("billingMonth", event.target.value)}
          />
        </label>
      </div>

      {analysis ? (
        <div className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-lg bg-zinc-50 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
              <Gauge className="h-4 w-4 text-amber-700" />
              Resultado
            </div>
            <p className="mt-3 text-3xl font-semibold text-industrial-ink">
              {formatCurrency(analysis.estimatedSavingsClp)}
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              {formatPercent(analysis.estimatedSavingsPercent)} mensual estimado
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-md border border-zinc-200 bg-white p-3">
                <p className="text-xs font-medium uppercase text-zinc-500">
                  Score
                </p>
                <p className="mt-1 text-lg font-semibold text-industrial-ink">
                  {analysis.opportunityScore}/100
                </p>
              </div>
              <div className="rounded-md border border-zinc-200 bg-white p-3">
                <p className="text-xs font-medium uppercase text-zinc-500">
                  Anual
                </p>
                <p className="mt-1 text-lg font-semibold text-industrial-ink">
                  {formatCurrency(analysis.annualSavingsClp)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-200 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
              <Zap className="h-4 w-4 text-teal-700" />
              Recomendaciones
            </div>
            <div className="mt-4 space-y-3">
              {analysis.recommendations.slice(0, 4).map((recommendation) => (
                <div key={recommendation.code} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
                  <div>
                    <p className="text-sm font-medium text-industrial-ink">
                      {recommendation.title}
                    </p>
                    <p className="mt-1 text-sm leading-5 text-zinc-600">
                      {recommendation.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {status === "saved" ? (
              <p className="mt-4 inline-flex items-center gap-2 rounded-md bg-teal-50 px-3 py-2 text-sm font-medium text-teal-700">
                <FileText className="h-4 w-4" />
                Boleta guardada con diagnóstico
              </p>
            ) : null}
            {status === "error" ? (
              <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                No se pudo calcular o guardar. Revisa los datos ingresados.
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}
