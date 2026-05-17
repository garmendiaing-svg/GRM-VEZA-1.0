import { NextResponse } from "next/server";
import { z } from "zod";

import { analyzeElectricBill } from "@/domain/energy/analyze-electric-bill";

const analyzeSchema = z.object({
  totalAmountClp: z.coerce.number().positive(),
  energyKwh: z.coerce.number().nonnegative().optional(),
  energyCostClp: z.coerce.number().nonnegative().optional(),
  powerChargeClp: z.coerce.number().nonnegative().optional(),
  reactivePenaltyClp: z.coerce.number().nonnegative().optional(),
  otherChargesClp: z.coerce.number().nonnegative().optional(),
  contractedPowerKw: z.coerce.number().nonnegative().optional(),
  peakDemandKw: z.coerce.number().nonnegative().optional(),
  businessType: z.string().optional(),
  distributor: z.string().optional()
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = analyzeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid bill payload", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  return NextResponse.json(analyzeElectricBill(parsed.data));
}
