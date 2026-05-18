import { NextResponse } from "next/server";
import { z } from "zod";

import { requireApiKey } from "@/server/auth/guard";
import {
  createRepositoryCompany,
  getRepositoryDashboardSnapshot
} from "@/server/data/repository";

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
  const snapshot = await getRepositoryDashboardSnapshot();
  return NextResponse.json(snapshot.companies);
}

export async function POST(request: Request) {
  const unauthorized = requireApiKey(request);

  if (unauthorized) {
    return unauthorized;
  }

  const body = await request.json();
  const parsed = companySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid company", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  return NextResponse.json(await createRepositoryCompany(parsed.data), {
    status: 201
  });
}
