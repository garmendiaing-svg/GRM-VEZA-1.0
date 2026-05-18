import {
  analyzeElectricBill,
  type AuditItem,
  type EnergyAnalysisResult,
  type RecommendationCategory
} from "@/domain/energy/analyze-electric-bill";
import { createCommercialProposal } from "@/domain/finance/create-proposal";
import { prisma } from "@/server/db/prisma";

export async function getPrismaDashboardSnapshot() {
  const [companies, sites, bills, persistedAnalyses, proposals] = await Promise.all([
    prisma.company.findMany({ orderBy: { createdAt: "desc" }, take: 25 }),
    prisma.site.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
    prisma.electricBill.findMany({ orderBy: { createdAt: "desc" }, take: 25 }),
    prisma.energyAnalysis.findMany({
      orderBy: [{ opportunityScore: "desc" }, { createdAt: "desc" }],
      take: 25,
      include: { recommendations: true }
    }),
    prisma.proposal.findMany({ orderBy: { createdAt: "desc" }, take: 25 })
  ]);

  const analyses = persistedAnalyses.map((analysis) =>
    normalizeEnergyAnalysis(analysis)
  );
  const monthlySavingsClp = analyses.reduce(
    (sum, analysis) => sum + analysis.estimatedSavingsClp,
    0
  );

  return {
    totals: {
      companies: companies.length,
      sites: sites.length,
      bills: bills.length,
      analyses: analyses.length,
      monthlySavingsClp,
      annualSavingsClp: monthlySavingsClp * 12
    },
    companies,
    sites,
    bills,
    analyses,
    proposals
  };
}

type PersistedRecommendation = {
  id: string;
  category: string;
  priority: number;
  title: string;
  description: string;
  impactClp: number | null;
};

type PersistedAnalysis = Awaited<
  ReturnType<typeof prisma.energyAnalysis.findMany>
>[number] & {
  recommendations?: PersistedRecommendation[];
};

function normalizeEnergyAnalysis(
  analysis: PersistedAnalysis
): EnergyAnalysisResult & { id: string; siteId: string; billId: string | null } {
  return {
    id: analysis.id,
    siteId: analysis.siteId,
    billId: analysis.billId,
    totalAmountClp: analysis.totalAmountClp ?? 0,
    energyPercent: analysis.energyPercent,
    powerPercent: analysis.powerPercent ?? 0,
    reactivePercent: analysis.reactivePercent ?? 0,
    otherChargesPercent: analysis.otherChargesPercent ?? 0,
    powerIssue: analysis.powerIssue,
    reactiveIssue: analysis.reactiveIssue,
    consumptionIssue: analysis.consumptionIssue,
    qualityIssue: analysis.qualityIssue,
    estimatedSavingsPercent: analysis.estimatedSavingsPercent ?? 0,
    estimatedSavingsClp: analysis.estimatedSavingsClp ?? 0,
    annualSavingsClp: analysis.annualSavingsClp ?? 0,
    opportunityScore: analysis.opportunityScore,
    technicalSummary: analysis.technicalSummary ?? "",
    commercialSummary: analysis.commercialSummary ?? "",
    recommendations: (analysis.recommendations ?? []).map((recommendation) => ({
      code: recommendation.id,
      category: recommendation.category as RecommendationCategory,
      priority: Math.min(Math.max(recommendation.priority, 1), 3) as 1 | 2 | 3,
      title: recommendation.title,
      description: recommendation.description,
      estimatedImpactClp: recommendation.impactClp ?? undefined
    })),
    auditTrail: Array.isArray(analysis.auditTrail)
      ? (analysis.auditTrail as AuditItem[])
      : []
  };
}

export async function createPrismaCompany(input: {
  name: string;
  taxId?: string;
  email?: string;
  phone?: string;
  site?: {
    name: string;
    address?: string;
    businessType?: string;
  };
}) {
  const company = await prisma.company.create({
    data: {
      name: input.name,
      taxId: input.taxId,
      email: input.email,
      phone: input.phone,
      sites: input.site
        ? {
            create: {
              name: input.site.name,
              address: input.site.address,
              businessType: input.site.businessType
            }
          }
        : undefined
    },
    include: { sites: true }
  });

  const [site] = company.sites;
  return { company, site };
}

export async function createPrismaBillAndAnalysis(input: {
  siteId: string;
  distributor?: string;
  customerNumber?: string;
  billingMonth?: string;
  totalAmountClp: number;
  energyKwh?: number;
  energyCostClp?: number;
  powerChargeClp?: number;
  reactivePenaltyClp?: number;
  otherChargesClp?: number;
  contractedPowerKw?: number;
  peakDemandKw?: number;
  fileUrl?: string;
}) {
  const site = await prisma.site.findUnique({ where: { id: input.siteId } });

  if (!site) {
    throw new Error("Site not found");
  }

  const result = analyzeElectricBill({
    ...input,
    businessType: site.businessType
  });

  return prisma.$transaction(async (tx) => {
    const bill = await tx.electricBill.create({
      data: {
        siteId: input.siteId,
        distributor: input.distributor,
        customerNumber: input.customerNumber,
        billingMonth: input.billingMonth,
        totalAmountClp: input.totalAmountClp,
        energyKwh: input.energyKwh,
        energyCostClp: input.energyCostClp,
        powerChargeClp: input.powerChargeClp,
        reactivePenaltyClp: input.reactivePenaltyClp,
        otherChargesClp: input.otherChargesClp,
        contractedPowerKw: input.contractedPowerKw,
        peakDemandKw: input.peakDemandKw,
        fileUrl: input.fileUrl
      }
    });

    const analysis = await tx.energyAnalysis.create({
      data: {
        siteId: input.siteId,
        billId: bill.id,
        totalAmountClp: result.totalAmountClp,
        estimatedSavingsClp: result.estimatedSavingsClp,
        estimatedSavingsPercent: result.estimatedSavingsPercent,
        annualSavingsClp: result.annualSavingsClp,
        energyPercent: result.energyPercent,
        powerPercent: result.powerPercent,
        reactivePercent: result.reactivePercent,
        otherChargesPercent: result.otherChargesPercent,
        opportunityScore: result.opportunityScore,
        powerIssue: result.powerIssue,
        reactiveIssue: result.reactiveIssue,
        consumptionIssue: result.consumptionIssue,
        qualityIssue: result.qualityIssue,
        technicalSummary: result.technicalSummary,
        commercialSummary: result.commercialSummary,
        auditTrail: result.auditTrail,
        recommendations: {
          create: result.recommendations.map((recommendation) => ({
            category: recommendation.category,
            priority: recommendation.priority,
            title: recommendation.title,
            description: recommendation.description,
            impactClp: recommendation.estimatedImpactClp
          }))
        }
      },
      include: { recommendations: true }
    });

    return { bill, analysis: normalizeEnergyAnalysis(analysis) };
  });
}

export async function getPrismaAnalysisById(analysisId: string) {
  const analysis = await prisma.energyAnalysis.findUnique({
    where: { id: analysisId },
    include: { recommendations: true }
  });

  return analysis ? normalizeEnergyAnalysis(analysis) : null;
}

export async function createPrismaProposalFromAnalysis(input: {
  analysisId: string;
  implementationCostClp?: number;
  upfrontPercent?: number;
  sharedSavingsRate?: number;
}) {
  const analysis = await getPrismaAnalysisById(input.analysisId);

  if (!analysis) {
    return null;
  }

  const proposal = createCommercialProposal({
    analysis,
    implementationCostClp: input.implementationCostClp,
    upfrontPercent: input.upfrontPercent,
    sharedSavingsRate: input.sharedSavingsRate
  });

  return prisma.proposal.create({
    data: {
      analysisId: analysis.id,
      title: proposal.title,
      implementationClp: proposal.implementationCostClp,
      upfrontPercent: proposal.upfrontPaymentClp / proposal.implementationCostClp,
      sharedSavingsRate: proposal.sharedSavingsRate,
      monthlyFeeClp: proposal.suggestedMonitoringFeeClp,
      payload: proposal
    }
  });
}
