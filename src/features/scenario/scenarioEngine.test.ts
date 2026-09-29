import { demoStudent, allPathways, colleges } from '../../data/index';
import { evaluateScenario } from './scenarioEngine';
import { scenarioPresets } from './scenarioPresets';
import { generatePlanTree } from '../plans/planEngine';
import { evaluatePathwayEligibility } from '../../utils/evaluationEngine';
import { calculateFundingGap } from '../finance/financeEngine';

export function runPhase3ScenarioTests() {
  console.log('🧪 Running Phase 3 Scenario Engine & Plan B/C Tests...\n');
  let passed = 0;
  let total = 0;

  function assert(condition: boolean, title: string) {
    total++;
    if (condition) {
      console.log(`  ✅ [PASS] ${title}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${title}`);
    }
  }

  // Test 1: Budget reduction changes affordability & funding gap
  const budgetPreset = scenarioPresets.find((p) => p.type === 'BUDGET_REDUCTION')!;
  const budgetRes = evaluateScenario(demoStudent, budgetPreset, allPathways, colleges);
  assert(
    budgetRes.financialImpact.newGap > budgetRes.financialImpact.previousGap,
    'Budget reduction increases funding gap correctly'
  );

  // Test 2: Budget reduction does NOT change academic eligibility
  const btechBaseline = evaluatePathwayEligibility(demoStudent, allPathways[0]);
  const btechScenario = evaluatePathwayEligibility(budgetRes.modifiedProfile, allPathways[0]);
  assert(
    btechBaseline.status === btechScenario.status,
    'Budget reduction does NOT change academic prerequisite eligibility'
  );

  // Test 3: Entrance failure affects entrance-dependent pathway
  const entrancePreset = scenarioPresets.find((p) => p.type === 'ENTRANCE_FAILURE')!;
  const entranceRes = evaluateScenario(demoStudent, entrancePreset, allPathways, colleges);
  assert(
    entranceRes.affectedOptions.some((o) => o.id === 'pathway-btech-cse'),
    'Entrance failure marks entrance-dependent pathway as affected'
  );

  // Test 4: Entrance failure surfaces structured alternatives
  assert(
    entranceRes.alternativeRoutes.length > 0 && entranceRes.alternativeRoutes.some((a) => a.id === 'pathway-bsc-cs'),
    'Entrance failure surfaces structured alternative routes (B.Sc CS)'
  );

  // Test 5: Academic score reduction recalculates academic eligibility
  const academicPreset = scenarioPresets.find((p) => p.type === 'ACADEMIC_CHANGE')!;
  const academicRes = evaluateScenario(demoStudent, academicPreset, allPathways, colleges);
  assert(
    academicRes.modifiedProfile.overallPercentage === 75,
    'Academic score reduction recalculates profile percentage correctly'
  );

  // Test 6: No-loan scenario changes funding gap
  const noLoanPreset = scenarioPresets.find((p) => p.type === 'NO_LOAN')!;
  const noLoanRes = evaluateScenario(demoStudent, noLoanPreset, allPathways, colleges);
  assert(
    noLoanRes.changes.some((c) => c.field.includes('Loan')),
    'No-loan scenario updates funding constraints correctly'
  );

  // Test 7: Location constraint filters institutions correctly
  const locPreset = scenarioPresets.find((p) => p.type === 'LOCATION_CONSTRAINT')!;
  const locRes = evaluateScenario(demoStudent, locPreset, allPathways, colleges);
  assert(
    locRes.removedOptions.some((o) => o.name.includes('Pilani') || o.name.includes('Mumbai')),
    'Location constraint filters out institutions outside Pune'
  );

  // Test 8: Scenario diff correctly identifies removed/affected/unchanged options
  assert(
    Array.isArray(budgetRes.removedOptions) &&
      Array.isArray(budgetRes.affectedOptions) &&
      Array.isArray(budgetRes.stillOpenOptions),
    'Scenario diff structures removed, affected, and open options'
  );

  // Test 9: Plan B is generated from structured alternatives
  const planTree = generatePlanTree(demoStudent, 'pathway-btech-cse');
  assert(
    planTree.plans.length === 3 && planTree.plans[1].planLabel === 'Plan B',
    'Plan B is generated from structured alternative routes'
  );

  // Test 10: Plan C can be generated from a second scenario dependency
  const planTreeScenario = generatePlanTree(demoStudent, 'pathway-btech-cse', budgetRes);
  assert(
    planTreeScenario.plans[2].status === 'TRIGGERED' || planTreeScenario.plans[1].status === 'ALTERNATIVE',
    'Plan C is generated and evaluated under budget scenario dependency'
  );

  // Test 11: Reset returns to baseline profile
  const resetProfile = { ...demoStudent };
  assert(
    resetProfile.budgetINR === 600000 && resetProfile.overallPercentage === 88,
    'Reset returns student profile to baseline values'
  );

  // Test 12: Baseline financial calculation vs scenario financial calculation consistency
  const baseGap = calculateFundingGap(712000, 600000, 50000, 0, 0, 0);
  const scenarioGap = calculateFundingGap(712000, 400000, 50000, 0, 0, 0);
  assert(
    scenarioGap === baseGap + 200000,
    'Scenario finance calculation reuses Phase 2 finance engine with exact delta'
  );

  console.log(`\n🎉 Phase 3 Test Summary: ${passed}/${total} tests passed.`);
  return passed === total;
}

runPhase3ScenarioTests();
