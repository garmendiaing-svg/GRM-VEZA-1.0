import { NextResponse } from "next/server";
import { z } from "zod";

import { requireApiKey } from "@/server/auth/guard";
import {
  createRepositoryBillAndAnalysis,
  getRepositoryDashboardSnapshot
} from "@/server/data/repository";

const billSchema = z.object({
  siteId: z.string().min(1),
  distributor: z.string().optional(),
  customerNumber: z.string().optional(),
  billingMonth: z.string().optional(),
  totalAmountClp: z.coerce.number().positive(),
  energyKwh: z.coerce.number().nonnegative().optional(),
  energyCostClp: z.coerce.number().nonnegative().optional(),
  powerChargeClp: z.coerce.number().nonnegative().optional(),
  reactivePenaltyClp: z.coerce.number().nonnegative().optional(),
  otherChargesClp: z.coerce.number().nonnegative().optional(),
  contractedPowerKw: z.coerce.number().nonnegative().optional(),
  peakDemandKw: z.coerce.number().nonnegative().optional(),
  fileUrl: z.string().url().optional()
});

export async function GET() {
  const snapshot = await getRepositoryDashboardSnapshot();
  return NextResponse.json(snapshot.bills);
}

export async function POST(request: Request) {
  const unauthorized = requireApiKey(request);

  if (unauthorized) {
    return unauthorized;
  }

  const body = await request.json();
  const parsed = billSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid electric bill", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const result = await createRepositoryBillAndAnalysis(parsed.data);
  return NextResponse.json(result, { status: 201 });
}
