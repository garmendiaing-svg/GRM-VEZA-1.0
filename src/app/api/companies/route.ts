import { NextResponse } from "next/server";
import { z } from "zod";

import { createCompany, getDashboardSnapshot } from "@/server/data/store";

const companySchema = z.object({
  name: z.string().min(2),
  taxId: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  site: z
    .object({
      name: z.string().min(2),
      address: z.string().optional(),
      businessType: z.string().optional()
    })
    .optional()
});

export async function GET() {
  return NextResponse.json(getDashboardSnapshot().companies);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = companySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid company", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  return NextResponse.json(createCompany(parsed.data), { status: 201 });
}
