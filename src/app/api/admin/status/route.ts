import { NextResponse } from "next/server";

import { getRuntimeStatus } from "@/server/config/runtime";

export async function GET() {
  return NextResponse.json(getRuntimeStatus());
}
