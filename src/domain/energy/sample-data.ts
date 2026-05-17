import { analyzeElectricBill } from "./analyze-electric-bill";

export const sampleBakeryBill = {
  distributor: "CGE",
  businessType: "panaderia",
  totalAmountClp: 859812,
  energyKwh: 4620,
  energyCostClp: 347581,
  powerChargeClp: 310562,
  reactivePenaltyClp: 92140,
  otherChargesClp: 109529
};

export const sampleBakeryAnalysis = analyzeElectricBill(sampleBakeryBill);
