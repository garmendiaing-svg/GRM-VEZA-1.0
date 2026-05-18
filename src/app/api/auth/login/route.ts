import { NextResponse } from "next/server";
import { z } from "zod";

import { createSessionToken, SESSION_COOKIE } from "@/server/auth/session";

const loginSchema = z.object({
  passcode: z.string().min(1)
});

export async function POST(request: Request) {
  const expected = process.env.APP_PASSCODE;

  if (!expected) {
    return NextResponse.json({
      ok: true,
      detail: "APP_PASSCODE is not configured; app is open."
    });
  }

  const body = await request.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success || parsed.data.passcode !== expected) {
    return NextResponse.json(
      { error: "Invalid passcode" },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, createSessionToken(expected), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12
  });

  return response;
}
