import { NextResponse } from "next/server";
import { z } from "zod";

import { requireApiKey } from "@/server/auth/guard";
import { createUploadTarget } from "@/server/storage/upload-target";

const uploadSchema = z.object({
  fileName: z.string().min(1),
  contentType: z.string().min(3),
  folder: z.enum(["bills", "boards", "evidence"]).optional()
});

export async function POST(request: Request) {
  const unauthorized = requireApiKey(request);

  if (unauthorized) {
    return unauthorized;
  }

  const body = await request.json();
  const parsed = uploadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid upload payload", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  return NextResponse.json(await createUploadTarget(parsed.data));
}
