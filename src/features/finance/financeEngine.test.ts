import {
  calculateFundingGap,
  calculateMonthlyEMI,
  calculateTotalRepayment,
  calculateTotalInterest,
  calculateFundingStack,
  evaluateLoanScenario,
} from './financeEngine';
import { loanOptions } from '../../data/finance/loanOptions';
import { scholarships } from '../../data/scholarships/index';
import { colleges } from '../../data/institutions/colleges';
import { compareInstitutions, calculateInstitutionTotalCost } from '../compare/comparisonEngine';

export function runPhase2FinanceTests() {
  console.log('🧪 Running Phase 2 Finance & Comparison Engine Tests...\n');
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

  // Test 1: Institution comparison returns selected institutions
  const selectedIds = ['inst-iit-bombay', 'inst-coep-pune'];
  const comparison = compareInstitutions(colleges, selectedIds, 600000);
  assert(
    comparison.selectedInstitutions.length === 2 &&
      comparison.selectedInstitutions.map((i) => i.id).includes('inst-iit-bombay'),
    'Institution comparison returns selected institutions correctly'
  );

  // Test 2: Total cost is correctly derived from components (Tuition + Hostel + Living + Mandatory) * Years
  const iitB = colleges.find((c) => c.id === 'inst-iit-bombay')!;
  const derivedCost = calculateInstitutionTotalCost(iitB);
  const expectedCost = (220000 + 45000 + 25000 + 10000) * 4; // 3,00,000 * 4 = 12,00,000
  assert(derivedCost === expectedCost, `Total cost correctly derived from components (Expected: ₹${expectedCost}, Got: ₹${derivedCost})`);

  // Test 3: Funding gap calculation is correct
  const gap = calculateFundingGap(712000, 600000, 50000, 0, 0, 0); // 7,12,000 - 6,50,000 = 62,000
  assert(gap === 62000, `Funding gap calculation is correct (Expected: 62,000, Got: ${gap})`);

  // Test 4: Funding gap becomes zero when funding >= cost
  const zeroGap = calculateFundingGap(500000, 600000, 50000, 0, 0, 0);
  assert(zeroGap === 0, 'Funding gap becomes zero when funding >= cost');

  // Test 5: Loan EMI calculation works (Standard interest loan)
  const sbiLoan = loanOptions.find((l) => l.id === 'loan-sbi-scholar')!;
  const emi = calculateMonthlyEMI(200000, 8.15, 7);
  assert(emi >= 3130 && emi <= 3135, `Loan EMI calculation works correctly (Got EMI: ₹${emi})`);

  // Test 6: Zero-interest loan handled safely without division by zero crash
  const zeroEmi = calculateMonthlyEMI(120000, 0, 2); // 120,000 / 24 months = 5,000
  assert(zeroEmi === 5000, `Zero-interest loan handled safely without error (Got EMI: ₹${zeroEmi})`);

  // Test 7: Total repayment and total interest are correct
  const totalRepayment = calculateTotalRepayment(zeroEmi, 2); // 5,000 * 24 = 120,000
  const totalInterest = calculateTotalInterest(totalRepayment, 120000); // 0
  assert(
    totalRepayment === 120000 && totalInterest === 0,
    'Total repayment and total interest calculated correctly for zero-interest loan'
  );

  // Test 8: Funding stack totals correctly
  const stack = calculateFundingStack(800000, 600000, [scholarships[0]], 50000, 0, 0);
  assert(
    stack.totalEducationCost === 800000 &&
      stack.familyContribution === 600000 &&
      stack.scholarshipAmount === 80000 &&
      stack.loanAmount === 50000 &&
      stack.fundingGap === 70000,
    'Funding stack totals correctly'
  );

  // Test 9: Changing family contribution changes funding gap dynamically
  const updatedStack = calculateFundingStack(800000, 500000, [scholarships[0]], 50000, 0, 0);
  assert(
    updatedStack.fundingGap === stack.fundingGap + 100000,
    'Changing family contribution changes funding gap dynamically'
  );

  // Test 10: Loan scenario evaluation
  const loanEval = evaluateLoanScenario(sbiLoan, 200000);
  assert(
    loanEval.monthlyEMI > 0 && loanEval.totalRepayment > 200000 && loanEval.totalInterest > 0,
    'Loan scenario evaluation outputs complete repayment and interest metrics'
  );

  console.log(`\n🎉 Phase 2 Test Summary: ${passed}/${total} tests passed.`);
  return passed === total;
}

runPhase2FinanceTests();
