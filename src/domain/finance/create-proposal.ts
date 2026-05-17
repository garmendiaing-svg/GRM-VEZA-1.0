import type { EnergyAnalysisResult } from "@/domain/energy/analyze-electric-bill";

export type CommercialProposalInput = {
  analysis: Pick<
    EnergyAnalysisResult,
    "estimatedSavingsClp" | "estimatedSavingsPercent" | "annualSavingsClp"
  >;
  implementationCostClp?: number;
  upfrontPercent?: number;
  sharedSavingsRate?: number;
  termMonths?: number;
};

export type CommercialProposal = {
  title: string;
  monthlyEstimatedSavingsClp: number;
  annualEstimatedSavingsClp: number;
  implementationCostClp: number;
  upfrontPaymentClp: number;
  financedAmountClp: number;
  sharedSavingsRate: number;
  monthlySharedSavingsClp: number;
  suggestedMonitoringFeeClp: number;
  estimatedPaybackMonths: number | null;
  notes: string[];
};

function roundClp(value: number): number {
  return Math.max(0, Math.round(value));
}

export function createCommercialProposal(
  input: CommercialProposalInput
): CommercialProposal {
  const monthlySavings = roundClp(input.analysis.estimatedSavingsClp);
  const implementationCost =
    input.implementationCostClp ?? Math.max(650000, monthlySavings * 4);
  const upfrontPercent = input.upfrontPercent ?? 0.35;
  const sharedSavingsRate = input.sharedSavingsRate ?? 0.3;

  const upfrontPaymentClp = roundClp(implementationCost * upfrontPercent);
  const financedAmountClp = roundClp(implementationCost - upfrontPaymentClp);
  const monthlySharedSavingsClp = roundClp(monthlySavings * sharedSavingsRate);
  const suggestedMonitoringFeeClp = Math.max(
    49000,
    roundClp(monthlySavings * 0.12)
  );
  const estimatedPaybackMonths =
    monthlySavings > 0 ? Math.ceil(implementationCost / monthlySavings) : null;

  return {
    title: "Propuesta preliminar ESCO",
    monthlyEstimatedSavingsClp: monthlySavings,
    annualEstimatedSavingsClp: roundClp(input.analysis.annualSavingsClp),
    implementationCostClp: roundClp(implementationCost),
    upfrontPaymentClp,
    financedAmountClp,
    sharedSavingsRate,
    monthlySharedSavingsClp,
    suggestedMonitoringFeeClp,
    estimatedPaybackMonths,
    notes: [
      "Valores preliminares sujetos a visita tecnica y medicion.",
      "El ahorro compartido debe calcularse contra linea base acordada.",
      "La suscripcion cubre seguimiento mensual, alertas y reportabilidad."
    ]
  };
}
