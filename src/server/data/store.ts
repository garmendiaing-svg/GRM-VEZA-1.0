import {
  analyzeElectricBill,
  type ElectricBillAnalysisInput,
  type EnergyAnalysisResult
} from "@/domain/energy/analyze-electric-bill";
import { sampleBakeryBill } from "@/domain/energy/sample-data";
import { createCommercialProposal } from "@/domain/finance/create-proposal";

export type CompanyRecord = {
  id: string;
  name: string;
  taxId?: string;
  email?: string;
  phone?: string;
  createdAt: string;
};

export type SiteRecord = {
  id: string;
  companyId: string;
  name: string;
  address?: string;
  businessType?: string;
};

export type BillRecord = ElectricBillAnalysisInput & {
  id: string;
  siteId: string;
  customerNumber?: string;
  billingMonth?: string;
  fileUrl?: string;
  createdAt: string;
};

export type AnalysisRecord = EnergyAnalysisResult & {
  id: string;
  siteId: string;
  billId?: string;
  createdAt: string;
};

export type ProposalRecord = ReturnType<typeof createCommercialProposal> & {
  id: string;
  analysisId: string;
  status: "DRAFT" | "SENT" | "ACCEPTED" | "REJECTED";
  createdAt: string;
};

function id(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

const createdAt = new Date().toISOString();
const demoBill: BillRecord = {
  id: "bill_demo",
  siteId: "site_demo",
  customerNumber: "CGE-0001",
  billingMonth: "2026-04",
  createdAt,
  ...sampleBakeryBill
};

const demoAnalysis: AnalysisRecord = {
  id: "analysis_demo",
  siteId: "site_demo",
  billId: demoBill.id,
  createdAt,
  ...analyzeElectricBill(sampleBakeryBill)
};

const companies: CompanyRecord[] = [
  {
    id: "company_demo",
    name: "Panaderia Centro",
    taxId: "76.123.456-7",
    email: "dueno@panaderiacentro.cl",
    phone: "+56 9 5555 5555",
    createdAt
  }
];

const sites: SiteRecord[] = [
  {
    id: "site_demo",
    companyId: "company_demo",
    name: "Local matriz",
    address: "Santiago, Chile",
    businessType: "panaderia"
  }
];

const bills: BillRecord[] = [demoBill];
const analyses: AnalysisRecord[] = [demoAnalysis];
const proposals: ProposalRecord[] = [];

export function getDashboardSnapshot() {
  const monthlySavingsClp = analyses.reduce(
    (sum, analysis) => sum + analysis.estimatedSavingsClp,
    0
  );
  const latestAnalyses = [...analyses].sort(
    (a, b) => b.opportunityScore - a.opportunityScore
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
    bills: bills.slice(0, 10),
    analyses: latestAnalyses.slice(0, 10),
    proposals
  };
}

export function createCompany(input: {
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
  const company: CompanyRecord = {
    id: id("company"),
    name: input.name,
    taxId: input.taxId,
    email: input.email,
    phone: input.phone,
    createdAt: new Date().toISOString()
  };

  companies.unshift(company);

  const site = input.site
    ? createSite({
        companyId: company.id,
        name: input.site.name,
        address: input.site.address,
        businessType: input.site.businessType
      })
    : undefined;

  return { company, site };
}

export function createSite(input: {
  companyId: string;
  name: string;
  address?: string;
  businessType?: string;
}) {
  const site: SiteRecord = {
    id: id("site"),
    companyId: input.companyId,
    name: input.name,
    address: input.address,
    businessType: input.businessType
  };

  sites.unshift(site);
  return site;
}

export function createBillAndAnalysis(
  input: Omit<BillRecord, "id" | "createdAt">
) {
  const site = sites.find((item) => item.id === input.siteId);

  const bill: BillRecord = {
    ...input,
    id: id("bill"),
    createdAt: new Date().toISOString()
  };
  bills.unshift(bill);

  const analysisResult = analyzeElectricBill({
    ...input,
    businessType: input.businessType ?? site?.businessType ?? null
  });
  const analysis: AnalysisRecord = {
    ...analysisResult,
    id: id("analysis"),
    siteId: input.siteId,
    billId: bill.id,
    createdAt: new Date().toISOString()
  };
  analyses.unshift(analysis);

  return { bill, analysis };
}

export function getAnalysisById(analysisId: string) {
  return analyses.find((analysis) => analysis.id === analysisId);
}

export function createProposalFromAnalysis(input: {
  analysisId: string;
  implementationCostClp?: number;
  upfrontPercent?: number;
  sharedSavingsRate?: number;
}) {
  const analysis = getAnalysisById(input.analysisId);

  if (!analysis) {
    return null;
  }

  const proposal: ProposalRecord = {
    id: id("proposal"),
    analysisId: analysis.id,
    status: "DRAFT",
    createdAt: new Date().toISOString(),
    ...createCommercialProposal({
      analysis,
      implementationCostClp: input.implementationCostClp,
      upfrontPercent: input.upfrontPercent,
      sharedSavingsRate: input.sharedSavingsRate
    })
  };

  proposals.unshift(proposal);
  return proposal;
}
