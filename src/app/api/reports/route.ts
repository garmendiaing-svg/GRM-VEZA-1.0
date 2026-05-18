import { NextResponse } from "next/server";
import { z } from "zod";

import { getRepositoryAnalysisById } from "@/server/data/repository";

const reportSchema = z.object({
  analysisId: z.string().min(1)
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = reportSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid report payload", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const analysis = await getRepositoryAnalysisById(parsed.data.analysisId);

  if (!analysis) {
    return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
  }

  return NextResponse.json({
    title: "Diagnostico preliminar de ahorro electrico",
    generatedAt: new Date().toISOString(),
    analysis,
    sections: [
      {
        title: "Resumen ejecutivo",
        body: analysis.commercialSummary
      },
      {
        title: "Hallazgos tecnicos",
        body: analysis.technicalSummary
      },
      {
        title: "Recomendaciones",
        items: analysis.recommendations
      }
    ]
  });
}
