import { NextResponse } from "next/server";

import { getRepositoryDashboardSnapshot } from "@/server/data/repository";

export async function GET() {
  return NextResponse.json(await getRepositoryDashboardSnapshot());
}
