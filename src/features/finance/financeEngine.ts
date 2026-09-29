import type { FinanceProfile, LoanOption, Scholarship } from '@/types';

// ─── 1. Calculate Funding Gap ─────────────────────────────────────
export function calculateFundingGap(
  totalCost: number,
  familyContrib: number,
  scholarshipAmount = 0,
  govtSupport = 0,
  loanAmount = 0,
  otherFunding = 0
): number {
  const totalFunding = familyContrib + scholarshipAmount + govtSupport + loanAmount + otherFunding;
  return Math.max(0, Math.round(totalCost - totalFunding));
}

// ─── 2. Calculate Loan Amount Needed ──────────────────────────────
export function calculateLoanAmount(
  totalCost: number,
  familyContrib: number,
  scholarshipAmount = 0,
  govtSupport = 0,
  otherFunding = 0
): number {
  const currentFunding = familyContrib + scholarshipAmount + govtSupport + otherFunding;
  return Math.max(0, Math.round(totalCost - currentFunding));
}

// ─── 3. Calculate Monthly EMI (Handles zero interest safely) ──────
export function calculateMonthlyEMI(
  principal: number,
  annualInterestRate: number,
  tenureYears: number
): number {
  if (principal <= 0 || tenureYears <= 0) return 0;
  const totalMonths = Math.round(tenureYears * 12);

  // Safe zero-interest loan handling
  if (annualInterestRate === 0) {
    return Math.round(principal / totalMonths);
  }

  const monthlyRate = annualInterestRate / (12 * 100);
  const factor = Math.pow(1 + monthlyRate, totalMonths);
  const emi = (principal * monthlyRate * factor) / (factor - 1);

  return Math.round(emi);
}

// ─── 4. Calculate Total Repayment ─────────────────────────────────
export function calculateTotalRepayment(emi: number, tenureYears: number): number {
  if (emi <= 0 || tenureYears <= 0) return 0;
  return Math.round(emi * tenureYears * 12);
}

// ─── 5. Calculate Total Interest Paid ─────────────────────────────
export function calculateTotalInterest(totalRepayment: number, principal: number): number {
  return Math.max(0, Math.round(totalRepayment - principal));
}

// ─── 6. Calculate Complete Funding Stack Profile ──────────────────
export function calculateFundingStack(
  cost: number,
  familyBudget: number,
  scholarshipList: Scholarship[] = [],
  loanAmount = 0,
  govtSupport = 0,
  otherFunding = 0
): FinanceProfile {
  const scholarshipAmount = scholarshipList.reduce((sum, s) => sum + (s.amount || s.amountINR || 0), 0);
  const gap = calculateFundingGap(cost, familyBudget, scholarshipAmount, govtSupport, loanAmount, otherFunding);

  return {
    totalEducationCost: cost,
    familyContribution: familyBudget,
    scholarshipAmount,
    governmentSupport: govtSupport,
    loanAmount,
    otherFunding,
    fundingGap: gap,
  };
}

// ─── 7. Evaluate Loan Scenario Performance ───────────────────────
export interface LoanCalculationResult {
  loanId: string;
  provider: string;
  principal: number;
  annualInterestRate: number;
  tenureYears: number;
  monthlyEMI: number;
  totalRepayment: number;
  totalInterest: number;
  processingFeeAmount: number;
  moratoriumMonths: number;
}

export function evaluateLoanScenario(
  loan: LoanOption,
  principal: number
): LoanCalculationResult {
  const emi = calculateMonthlyEMI(principal, loan.annualInterestRate, loan.tenureYears);
  const totalRepayment = calculateTotalRepayment(emi, loan.tenureYears);
  const totalInterest = calculateTotalInterest(totalRepayment, principal);
  const processingFeeAmount = Math.round((principal * loan.processingFee) / 100);

  return {
    loanId: loan.id,
    provider: loan.provider,
    principal,
    annualInterestRate: loan.annualInterestRate,
    tenureYears: loan.tenureYears,
    monthlyEMI: emi,
    totalRepayment,
    totalInterest,
    processingFeeAmount,
    moratoriumMonths: loan.moratoriumMonths,
  };
}
