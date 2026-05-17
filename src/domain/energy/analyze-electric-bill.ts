export type ElectricBillAnalysisInput = {
  totalAmountClp: number;
  energyKwh?: number | null;
  energyCostClp?: number | null;
  powerChargeClp?: number | null;
  reactivePenaltyClp?: number | null;
  otherChargesClp?: number | null;
  contractedPowerKw?: number | null;
  peakDemandKw?: number | null;
  businessType?: string | null;
  distributor?: string | null;
};

export type RecommendationCategory =
  | "POWER"
  | "REACTIVE"
  | "CONSUMPTION"
  | "QUALITY"
  | "VALIDATION"
  | "COMMERCIAL";

export type EnergyRecommendation = {
  code: string;
  category: RecommendationCategory;
  priority: 1 | 2 | 3;
  title: string;
  description: string;
  estimatedImpactClp?: number;
};

export type AuditItem = {
  rule: string;
  result: string;
  value: number | null;
  threshold?: number;
  rationale: string;
};

export type EnergyAnalysisResult = {
  totalAmountClp: number;
  energyPercent: number | null;
  powerPercent: number;
  reactivePercent: number;
  otherChargesPercent: number;
  powerIssue: boolean;
  reactiveIssue: boolean;
  consumptionIssue: boolean;
  qualityIssue: boolean;
  estimatedSavingsPercent: number;
  estimatedSavingsClp: number;
  annualSavingsClp: number;
  opportunityScore: number;
  technicalSummary: string;
  commercialSummary: string;
  recommendations: EnergyRecommendation[];
  auditTrail: AuditItem[];
};

const POWER_ISSUE_THRESHOLD = 0.2;
const REACTIVE_ISSUE_THRESHOLD = 0.05;
const ENERGY_CONSUMPTION_THRESHOLD = 0.55;
const NETWORK_CHARGE_THRESHOLD = 0.45;
const PRELIMINARY_SAVINGS_CAP = 0.45;

function positive(value?: number | null): number {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? value
    : 0;
}

function ratio(value: number, total: number): number {
  if (total <= 0 || value <= 0) {
    return 0;
  }

  return Math.min(value / total, 1);
}

function roundPercent(value: number): number {
  return Math.round(value * 10000) / 10000;
}

function roundClp(value: number): number {
  return Math.max(0, Math.round(value));
}

export function analyzeElectricBill(
  input: ElectricBillAnalysisInput
): EnergyAnalysisResult {
  const total = positive(input.totalAmountClp);

  if (total === 0) {
    throw new Error("totalAmountClp must be greater than zero");
  }

  const energyCost = positive(input.energyCostClp);
  const powerCharge = positive(input.powerChargeClp);
  const reactivePenalty = positive(input.reactivePenaltyClp);
  const declaredOtherCharges = positive(input.otherChargesClp);
  const knownCharges = energyCost + powerCharge + reactivePenalty;
  const inferredOtherCharges = Math.max(total - knownCharges, 0);
  const otherCharges = declaredOtherCharges || inferredOtherCharges;

  const energyPercent = energyCost ? ratio(energyCost, total) : null;
  const powerPercent = ratio(powerCharge, total);
  const reactivePercent = ratio(reactivePenalty, total);
  const otherChargesPercent = ratio(otherCharges, total);
  const networkChargesPercent = powerPercent + reactivePercent;

  const contractedPowerKw = positive(input.contractedPowerKw);
  const peakDemandKw = positive(input.peakDemandKw);
  const lowUseOfContractedPower =
    contractedPowerKw > 0 && peakDemandKw > 0
      ? peakDemandKw / contractedPowerKw < 0.55
      : false;

  const powerIssue = powerPercent >= POWER_ISSUE_THRESHOLD || lowUseOfContractedPower;
  const reactiveIssue = reactivePercent >= REACTIVE_ISSUE_THRESHOLD;
  const consumptionIssue =
    energyPercent !== null && energyPercent >= ENERGY_CONSUMPTION_THRESHOLD;
  const qualityIssue = reactiveIssue;

  const powerOptimizationPercent = powerIssue ? powerPercent * 0.65 : 0;
  const reactiveCompensationPercent = reactiveIssue ? reactivePercent * 0.8 : 0;
  const loadManagementPercent =
    networkChargesPercent >= NETWORK_CHARGE_THRESHOLD
      ? Math.min(0.08, networkChargesPercent * 0.18)
      : 0;
  const efficiencyPercent = consumptionIssue
    ? Math.min(0.08, (energyPercent ?? 0) * 0.1)
    : 0;

  const estimatedSavingsPercent = roundPercent(
    Math.min(
      PRELIMINARY_SAVINGS_CAP,
      powerOptimizationPercent +
        reactiveCompensationPercent +
        loadManagementPercent +
        efficiencyPercent
    )
  );
  const estimatedSavingsClp = roundClp(total * estimatedSavingsPercent);
  const annualSavingsClp = estimatedSavingsClp * 12;

  const recommendations: EnergyRecommendation[] = [];

  if (powerIssue) {
    recommendations.push({
      code: "POWER_CONTRACT_REVIEW",
      category: "POWER",
      priority: 1,
      title: "Revisar potencia contratada y cargos de demanda",
      description:
        "La potencia representa una fraccion relevante de la boleta. Conviene revisar contrato, demanda maxima y comportamiento en horario punta.",
      estimatedImpactClp: roundClp(total * powerOptimizationPercent)
    });
  }

  if (reactiveIssue) {
    recommendations.push({
      code: "REACTIVE_COMPENSATION",
      category: "REACTIVE",
      priority: 1,
      title: "Evaluar compensacion de energia reactiva",
      description:
        "La multa reactiva supera el umbral MVP. Se recomienda medir factor de potencia y dimensionar banco de condensadores si aplica.",
      estimatedImpactClp: roundClp(total * reactiveCompensationPercent)
    });
  }

  if (loadManagementPercent > 0) {
    recommendations.push({
      code: "LOAD_MANAGEMENT",
      category: "QUALITY",
      priority: 2,
      title: "Ordenar horarios y simultaneidad de cargas",
      description:
        "Los cargos de potencia y reactivos son altos en conjunto. La visita tecnica debe revisar hornos, frio, motores y arranques simultaneos.",
      estimatedImpactClp: roundClp(total * loadManagementPercent)
    });
  }

  if (consumptionIssue) {
    recommendations.push({
      code: "EFFICIENCY_REVIEW",
      category: "CONSUMPTION",
      priority: 2,
      title: "Revisar eficiencia de equipos e iluminacion",
      description:
        "El consumo de energia concentra la mayor parte del costo. Revisar refrigeracion, iluminacion, sellos, mantenciones y habitos operativos.",
      estimatedImpactClp: roundClp(total * efficiencyPercent)
    });
  }

  recommendations.push(
    {
      code: "FIELD_VALIDATION",
      category: "VALIDATION",
      priority: 1,
      title: "Validar cargas mediante visita tecnica",
      description:
        "El diagnostico es preliminar. Se debe contrastar la boleta con tablero, equipos, horarios y medicion antes de comprometer ahorros."
    },
    {
      code: "COMMERCIAL_SCOPE",
      category: "COMMERCIAL",
      priority: 3,
      title: "Separar diagnostico, ingenieria e implementacion",
      description:
        "La propuesta comercial debe distinguir ahorro estimado, medicion requerida, trabajos electricos y monitoreo mensual."
    }
  );

  const issueCount = [powerIssue, reactiveIssue, consumptionIssue, qualityIssue].filter(
    Boolean
  ).length;
  const opportunityScore = Math.min(
    100,
    Math.round(estimatedSavingsPercent * 180 + issueCount * 10)
  );

  const auditTrail: AuditItem[] = [
    {
      rule: "energy_percent",
      result: energyPercent === null ? "unknown" : "computed",
      value: energyPercent,
      rationale: "Relaciona cargo de energia con total de boleta."
    },
    {
      rule: "power_issue",
      result: powerIssue ? "triggered" : "not_triggered",
      value: roundPercent(powerPercent),
      threshold: POWER_ISSUE_THRESHOLD,
      rationale:
        "Potencia sobre 20% del total o baja utilizacion de potencia contratada."
    },
    {
      rule: "reactive_issue",
      result: reactiveIssue ? "triggered" : "not_triggered",
      value: roundPercent(reactivePercent),
      threshold: REACTIVE_ISSUE_THRESHOLD,
      rationale: "Multa reactiva sobre 5% del total."
    },
    {
      rule: "network_charge_cluster",
      result:
        networkChargesPercent >= NETWORK_CHARGE_THRESHOLD
          ? "triggered"
          : "not_triggered",
      value: roundPercent(networkChargesPercent),
      threshold: NETWORK_CHARGE_THRESHOLD,
      rationale:
        "Potencia y reactivos altos en conjunto sugieren oportunidad por gestion de cargas."
    },
    {
      rule: "preliminary_cap",
      result: "applied",
      value: PRELIMINARY_SAVINGS_CAP,
      rationale:
        "El MVP limita ahorros preliminares para no prometer resultados sin medicion."
    }
  ];

  const technicalSummary = [
    powerIssue
      ? "Se detecta peso elevado de potencia/demanda."
      : "No se detecta alerta fuerte de potencia con los datos ingresados.",
    reactiveIssue
      ? "Existe alerta por energia reactiva o factor de potencia."
      : "La energia reactiva no supera el umbral inicial.",
    consumptionIssue
      ? "El consumo energetico domina la boleta y requiere revision de eficiencia."
      : "El consumo directo no parece ser el unico problema principal."
  ].join(" ");

  const commercialSummary =
    estimatedSavingsPercent > 0.3
      ? "Oportunidad alta: conviene ofrecer visita tecnica, medicion y propuesta ESCO."
      : estimatedSavingsPercent > 0.12
        ? "Oportunidad media: se recomienda diagnostico guiado y validacion de cargas."
        : "Oportunidad baja o incompleta: solicitar mas datos antes de proponer inversion.";

  return {
    totalAmountClp: total,
    energyPercent: energyPercent === null ? null : roundPercent(energyPercent),
    powerPercent: roundPercent(powerPercent),
    reactivePercent: roundPercent(reactivePercent),
    otherChargesPercent: roundPercent(otherChargesPercent),
    powerIssue,
    reactiveIssue,
    consumptionIssue,
    qualityIssue,
    estimatedSavingsPercent,
    estimatedSavingsClp,
    annualSavingsClp,
    opportunityScore,
    technicalSummary,
    commercialSummary,
    recommendations,
    auditTrail
  };
}
