import { strict as assert } from "node:assert";

import { analyzeElectricBill } from "./analyze-electric-bill";
import { sampleBakeryBill } from "./sample-data";

const result = analyzeElectricBill(sampleBakeryBill);

assert.equal(result.powerIssue, true);
assert.equal(result.reactiveIssue, true);
assert.ok(result.estimatedSavingsPercent >= 0.38);
assert.ok(result.estimatedSavingsPercent <= 0.41);
assert.ok(result.estimatedSavingsClp > 320000);
assert.ok(result.recommendations.length >= 4);

console.log("Energy analysis rules OK", {
  estimatedSavingsPercent: result.estimatedSavingsPercent,
  estimatedSavingsClp: result.estimatedSavingsClp
});
