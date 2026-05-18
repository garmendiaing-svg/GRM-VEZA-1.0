import { NextResponse } from "next/server";

import { hasEnv } from "@/server/config/runtime";

export function authIsEnabled(): boolean {
  return hasEnv("ADMIN_API_KEY");
}

export function requireApiKey(request: Request): NextResponse | null {
  const expected = process.env.ADMIN_API_KEY;

  if (!expected) {
    return null;
  }

  const provided =
    request.headers.get("x-api-key") ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (provided === expected) {
    return null;
  }

  return NextResponse.json(
    { error: "Unauthorized", detail: "Missing or invalid API key" },
    { status: 401 }
  );
}
