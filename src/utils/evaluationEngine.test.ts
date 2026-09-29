import { demoStudent } from '../data/students/aarav';
import { pcmPathways, pcbPathways, commercePathways } from '../data/pathways/index';
import {
  evaluatePathwayEligibility,
  calculateOptionScore,
  evaluateRiskAndDependencies,
} from './evaluationEngine';

export function runEvaluationTests() {
  console.log('🧪 Running Pathway Evaluation Engine Tests...\n');
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

  // Test 1: PCM B.Tech CSE Eligibility for Aarav (Math 91, Sci 87)
  const btech = pcmPathways[0];
  const btechEval = evaluatePathwayEligibility(demoStudent, btech);
  assert(btechEval.status === 'eligible', 'Aarav is eligible for B.Tech CSE (PCM)');
  assert(btechEval.score >= 80, 'B.Tech CSE match score is high (>=80)');
  assert(btechEval.prerequisiteChecks.every(c => c.met), 'All B.Tech prerequisites met');

  // Test 2: Option Score for PCM Stream
  const pcmOptionScore = calculateOptionScore(btech, demoStudent);
  assert(pcmOptionScore.flexibilityLevel === 'High', 'PCM Stream option score is High flexibility');
  assert(pcmOptionScore.score >= 90, 'PCM Option Score >= 90');
  assert(pcmOptionScore.backupRoutes.length > 0, 'PCM has structured backup routes defined');

  // Test 3: Option Score for MBBS Stream (Hyper-specialized, Low flexibility)
  const mbbs = pcbPathways[0];
  const mbbsOptionScore = calculateOptionScore(mbbs, demoStudent);
  assert(mbbsOptionScore.flexibilityLevel === 'Low', 'MBBS Option Score is Low flexibility');
  assert(mbbsOptionScore.score < 60, 'MBBS Option Score < 60 due to early lock-in');

  // Test 4: Risk Analysis for MBBS (High Risk, single entrance gate)
  const mbbsRisk = evaluateRiskAndDependencies(mbbs);
  assert(mbbsRisk.riskLevel === 'High', 'MBBS is categorized as High Risk');
  assert(mbbsRisk.singlePointFailures.length > 0, 'MBBS identifies NEET-UG as single-point gate');
  assert(mbbsRisk.warnings.length > 0, 'MBBS generates dependency warning for dropping Math');

  // Test 5: Commerce Pathway Evaluation (CA)
  const ca = commercePathways[0];
  const caEval = evaluatePathwayEligibility(demoStudent, ca);
  assert(caEval.status === 'eligible', 'Aarav is eligible for CA pathway');

  console.log(`\n🎉 Test Summary: ${passed}/${total} tests passed.`);
  return passed === total;
}

// Execute if run directly
if (typeof globalThis !== 'undefined' && (globalThis as unknown as { process?: { argv?: string[] } }).process?.argv?.[1]?.includes('evaluationEngine.test')) {
  runEvaluationTests();
}
