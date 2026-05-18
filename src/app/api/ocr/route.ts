import { NextResponse } from "next/server";
import { z } from "zod";

import { extractElectricBillFromText } from "@/domain/ocr/extract-electric-bill";
import { requireApiKey } from "@/server/auth/guard";

const ocrSchema = z.object({
  text: z.string().min(5).optional(),
  fileUrl: z.string().url().optional(),
  provider: z.enum(["manual", "external"]).optional()
});

export async function POST(request: Request) {
  const unauthorized = requireApiKey(request);

  if (unauthorized) {
    return unauthorized;
  }

  const body = await request.json();
  const parsed = ocrSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid OCR payload", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const provider = parsed.data.provider ?? process.env.OCR_PROVIDER ?? "manual";

  if (provider !== "manual") {
    return NextResponse.json(
      {
        error: "OCR provider not configured",
        detail:
          "Define OCR_PROVIDER=manual o agrega credenciales del proveedor externo."
      },
      { status: 501 }
    );
  }

  if (!parsed.data.text) {
    return NextResponse.json(
      {
        error: "Manual OCR requires text",
        detail: "Pega texto extraido de la boleta o usa ingreso manual."
      },
      { status: 400 }
    );
  }

  return NextResponse.json({
    provider: "manual",
    fileUrl: parsed.data.fileUrl,
    extracted: extractElectricBillFromText(parsed.data.text)
  });
}
