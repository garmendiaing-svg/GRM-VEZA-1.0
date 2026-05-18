import {
  createBillAndAnalysis,
  createCompany,
  createProposalFromAnalysis,
  getAnalysisById,
  getDashboardSnapshot
} from "@/server/data/store";

function databaseEnabled() {
  return Boolean(process.env.DATABASE_URL);
}

export async function getRepositoryDashboardSnapshot() {
  if (!databaseEnabled()) {
    return getDashboardSnapshot();
  }

  try {
    const { getPrismaDashboardSnapshot } = await import("@/server/data/prisma-store");
    return await getPrismaDashboardSnapshot();
  } catch (error) {
    console.error("Prisma dashboard fallback", error);
    return getDashboardSnapshot();
  }
}

export async function createRepositoryCompany(input: Parameters<typeof createCompany>[0]) {
  if (!databaseEnabled()) {
    return createCompany(input);
  }

  try {
    const { createPrismaCompany } = await import("@/server/data/prisma-store");
    return await createPrismaCompany(input);
  } catch (error) {
    console.error("Prisma company fallback", error);
    return createCompany(input);
  }
}

export async function createRepositoryBillAndAnalysis(
  input: Parameters<typeof createBillAndAnalysis>[0]
) {
  if (!databaseEnabled()) {
    return createBillAndAnalysis(input);
  }

  try {
    const { createPrismaBillAndAnalysis } = await import(
      "@/server/data/prisma-store"
    );
    return await createPrismaBillAndAnalysis(input);
  } catch (error) {
    console.error("Prisma bill fallback", error);
    return createBillAndAnalysis(input);
  }
}

export async function getRepositoryAnalysisById(analysisId: string) {
  if (!databaseEnabled()) {
    return getAnalysisById(analysisId);
  }

  try {
    const { getPrismaAnalysisById } = await import("@/server/data/prisma-store");
    return await getPrismaAnalysisById(analysisId);
  } catch (error) {
    console.error("Prisma analysis fallback", error);
    return getAnalysisById(analysisId);
  }
}

export async function createRepositoryProposalFromAnalysis(
  input: Parameters<typeof createProposalFromAnalysis>[0]
) {
  if (!databaseEnabled()) {
    return createProposalFromAnalysis(input);
  }

  try {
    const { createPrismaProposalFromAnalysis } = await import(
      "@/server/data/prisma-store"
    );
    return await createPrismaProposalFromAnalysis(input);
  } catch (error) {
    console.error("Prisma proposal fallback", error);
    return createProposalFromAnalysis(input);
  }
}
