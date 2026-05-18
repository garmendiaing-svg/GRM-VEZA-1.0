import { NextResponse } from "next/server";
import { z } from "zod";

import { requireApiKey } from "@/server/auth/guard";
import { createRepositoryProposalFromAnalysis } from "@/server/data/repository";

const proposalSchema = z.object({
  analysisId: z.string().min(1),
  implementationCostClp: z.coerce.number().nonnegative().optional(),
  upfrontPercent: z.coerce.number().min(0).max(1).optional(),
  sharedSavingsRate: z.coerce.number().min(0).max(1).optional()
});

export async function POST(request: Request) {
  const unauthorized = requireApiKey(request);

  if (unauthorized) {
    return unauthorized;
  }

  const body = await request.json();
  const parsed = proposalSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid proposal payload", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const proposal = await createRepositoryProposalFromAnalysis(parsed.data);

  if (!proposal) {
    return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
  }

  return NextResponse.json(proposal, { status: 201 });
}
