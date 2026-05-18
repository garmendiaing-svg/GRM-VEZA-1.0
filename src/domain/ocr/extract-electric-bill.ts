type ExtractedBill = {
  distributor?: string;
  customerNumber?: string;
  billingMonth?: string;
  totalAmountClp?: number;
  energyKwh?: number;
  energyCostClp?: number;
  powerChargeClp?: number;
  reactivePenaltyClp?: number;
  otherChargesClp?: number;
  confidence: number;
  warnings: string[];
};

function parseClp(text: string, patterns: RegExp[]) {
  for (const pattern of patterns) {
    const match = text.match(pattern);

    if (match?.[1]) {
      const value = Number(match[1].replace(/[.$\s]/g, "").replace(",", "."));

      if (Number.isFinite(value)) {
        return Math.round(value);
      }
    }
  }

  return undefined;
}

function parseFloatValue(text: string, patterns: RegExp[]) {
  for (const pattern of patterns) {
    const match = text.match(pattern);

    if (match?.[1]) {
      const value = Number(match[1].replace(/\./g, "").replace(",", "."));

      if (Number.isFinite(value)) {
        return value;
      }
    }
  }

  return undefined;
}

export function extractElectricBillFromText(rawText: string): ExtractedBill {
  const text = rawText.replace(/\s+/g, " ").trim();
  const lower = text.toLowerCase();
  const warnings: string[] = [];

  const distributor = lower.includes("cge")
    ? "CGE"
    : lower.includes("enel")
      ? "Enel"
      : lower.includes("saesa")
        ? "Saesa"
        : undefined;
  const totalAmountClp = parseClp(text, [
    /total\s+a\s+pagar[:\s$]*([\d.$]+)/i,
    /monto\s+total[:\s$]*([\d.$]+)/i,
    /total\s+boleta[:\s$]*([\d.$]+)/i
  ]);
  const energyKwh = parseFloatValue(text, [
    /consumo\s*(?:energia|energ[ií]a)?[:\s]*([\d.,]+)\s*kwh/i,
    /([\d.,]+)\s*kwh/i
  ]);
  const energyCostClp = parseClp(text, [
    /cargo\s+energia[:\s$]*([\d.$]+)/i,
    /energ[ií]a\s+activa[:\s$]*([\d.$]+)/i,
    /consumo\s+energia[:\s$]*([\d.$]+)/i
  ]);
  const powerChargeClp = parseClp(text, [
    /cargo\s+potencia[:\s$]*([\d.$]+)/i,
    /potencia\s+(?:contratada|leida|maxima|m[aá]xima)[:\s$]*([\d.$]+)/i
  ]);
  const reactivePenaltyClp = parseClp(text, [
    /reactiva[:\s$]*([\d.$]+)/i,
    /factor\s+de\s+potencia[:\s$]*([\d.$]+)/i
  ]);
  const customerNumber = text.match(/(?:cliente|servicio|cuenta)[:\s#-]*([A-Z0-9.-]{4,})/i)?.[1];
  const billingMonth = text.match(/(20\d{2}[-/](?:0[1-9]|1[0-2]))/)?.[1]?.replace("/", "-");

  const found = [
    distributor,
    totalAmountClp,
    energyKwh,
    energyCostClp,
    powerChargeClp,
    reactivePenaltyClp
  ].filter(Boolean).length;

  if (!totalAmountClp) {
    warnings.push("No se detecto total a pagar.");
  }

  if (!energyCostClp && !powerChargeClp && !reactivePenaltyClp) {
    warnings.push("No se detectaron cargos separados; requiere revision manual.");
  }

  return {
    distributor,
    customerNumber,
    billingMonth,
    totalAmountClp,
    energyKwh,
    energyCostClp,
    powerChargeClp,
    reactivePenaltyClp,
    confidence: Math.min(0.95, found / 6),
    warnings
  };
}
