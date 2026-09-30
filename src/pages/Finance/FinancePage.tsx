import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { colleges, scholarships, loanOptions } from '@/data';
import { formatCurrency } from '@/utils';
import { usePathwayFinance } from '@/context/PathwayFinanceContext';
import { evaluateLoanScenario } from '@/features/finance/financeEngine';
import { calculateInstitutionTotalCost } from '@/features/compare/comparisonEngine';
import {
  Calculator,
  ShieldCheck,
  Building2,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react';

export function FinancePage() {
  const {
    activeInstitutionId,
    setActiveInstitutionId,
    activeInstitution,
    familyContribution,
    setFamilyContribution,
    selectedScholarshipIds,
    toggleScholarship,
    selectedScholarships,
    selectedLoanId,
    setSelectedLoanId,
    selectedLoan,
    loanAmount,
    setLoanAmount,
    financeProfile,
  } = usePathwayFinance();

  const [showAssumptions, setShowAssumptions] = useState(false);

  return (
    <div className="page-container space-y-6">
      {/* Page Header & Institution Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-navy-900 tracking-tight">Finance Planner & Funding Stack</h1>
            <Badge variant="navy" size="sm">Phase 2 Dynamic Engine</Badge>
          </div>
          <p className="text-sm text-neutral-500 mt-1 max-w-2xl">
            Calculate realistic funding gaps, explore scholarship combinations, and compare loan EMI scenarios.
          </p>
        </div>

        {/* Institution selector */}
        <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-neutral-200 shadow-xs shrink-0 max-w-full">
          <Building2 className="h-4 w-4 text-navy-700 shrink-0 ml-1" />
          <span className="text-xs font-semibold text-neutral-500 hidden sm:inline">Target Institute:</span>
          <select
            value={activeInstitutionId}
            onChange={(e) => setActiveInstitutionId(e.target.value)}
            className="text-xs font-bold text-navy-900 bg-neutral-100 px-2.5 py-1.5 rounded-lg border-0 focus:ring-2 focus:ring-navy-500 cursor-pointer max-w-[200px] truncate"
          >
            {colleges.map((c) => (
              <option key={c.id} value={c.id}>
                {c.shortName} ({formatCurrency(calculateInstitutionTotalCost(c), true)})
              </option>
            ))}
          </select>
        </div>
      </div>


      {/* Visual Funding Stack Section */}
      <Card id="finance-funding-stack" className="border-navy-200 shadow-sm overflow-hidden">
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-neutral-200">
            <div>
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
                Degree Funding Breakdown ({activeInstitution.programme})
              </span>
              <h2 className="text-2xl font-black text-navy-900 mt-0.5">
                Total Estimated Cost: {formatCurrency(financeProfile.totalEducationCost)}
              </h2>
            </div>

            {/* Funding Gap status */}
            <div className="text-right">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
                Calculated Funding Gap
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className={`text-2xl font-extrabold ${
                    financeProfile.fundingGap === 0 ? 'text-success-600' : 'text-danger-600'
                  }`}
                >
                  {financeProfile.fundingGap === 0
                    ? '₹0 (Fully Funded)'
                    : formatCurrency(financeProfile.fundingGap)}
                </span>
                <Badge
                  variant={financeProfile.fundingGap === 0 ? 'success' : 'danger'}
                  size="sm"
                >
                  {financeProfile.fundingGap === 0 ? 'Feasible' : 'Funding Deficit'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Visual Stacked Progress Bar */}
          <div className="mt-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-neutral-500 font-semibold">
              <span>Funding Assembly Progress</span>
              <span>
                {Math.round(
                  ((financeProfile.familyContribution +
                    financeProfile.scholarshipAmount +
                    financeProfile.loanAmount) /
                    financeProfile.totalEducationCost) *
                    100
                )}
                % Funded
              </span>
            </div>

            <div className="h-4 w-full bg-neutral-200 rounded-full overflow-hidden flex">
              {/* Family budget chunk */}
              <div
                style={{
                  width: `${Math.min(
                    100,
                    (financeProfile.familyContribution / financeProfile.totalEducationCost) * 100
                  )}%`,
                }}
                className="bg-navy-800 h-full transition-all"
                title={`Family Contribution: ${formatCurrency(financeProfile.familyContribution)}`}
              />
              {/* Scholarship chunk */}
              <div
                style={{
                  width: `${Math.min(
                    100,
                    (financeProfile.scholarshipAmount / financeProfile.totalEducationCost) * 100
                  )}%`,
                }}
                className="bg-success-500 h-full transition-all"
                title={`Scholarship: ${formatCurrency(financeProfile.scholarshipAmount)}`}
              />
              {/* Loan chunk */}
              <div
                style={{
                  width: `${Math.min(
                    100,
                    (financeProfile.loanAmount / financeProfile.totalEducationCost) * 100
                  )}%`,
                }}
                className="bg-amber-500 h-full transition-all"
                title={`Education Loan: ${formatCurrency(financeProfile.loanAmount)}`}
              />
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs pt-1 text-neutral-600">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-sm bg-navy-800" />
                <span>Family Budget: <strong>{formatCurrency(financeProfile.familyContribution)}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-sm bg-success-500" />
                <span>Scholarships: <strong>{formatCurrency(financeProfile.scholarshipAmount)}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-sm bg-amber-500" />
                <span>Education Loan: <strong>{formatCurrency(financeProfile.loanAmount)}</strong></span>
              </div>
            </div>
          </div>

          {/* Dynamic Family Budget Slider */}
          <div className="mt-6 p-4 bg-neutral-50 rounded-xl border border-neutral-200 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">
                Family Budget Contribution (Aarav's Profile: ₹6.0L):
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={100000}
                  max={1500000}
                  step={50000}
                  value={familyContribution}
                  onChange={(e) => setFamilyContribution(Number(e.target.value))}
                  className="w-full accent-navy-800 cursor-pointer"
                />
                <span className="text-xs font-bold text-navy-900 shrink-0">
                  {formatCurrency(familyContribution, true)}
                </span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">
                Required Education Loan Amount:
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={1500000}
                  step={25000}
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
                <span className="text-xs font-bold text-amber-900 shrink-0">
                  {formatCurrency(loanAmount, true)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loan Comparison Panel */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
              <Calculator className="h-4 w-4 text-navy-700" />
              Education Loan EMI Comparison ({formatCurrency(loanAmount)} Loan)
            </h3>
            <p className="text-xs text-neutral-500">Calculated dynamically using standard loan formulas</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {loanOptions.map((loan) => {
            const isSelected = loan.id === selectedLoanId;
            const evalResult = evaluateLoanScenario(loan, loanAmount);

            return (
              <div
                key={loan.id}
                onClick={() => setSelectedLoanId(loan.id)}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer space-y-3 relative ${
                  isSelected
                    ? 'bg-navy-50/50 border-navy-800 shadow-md ring-1 ring-navy-700'
                    : 'bg-white border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-start justify-between gap-1">
                  <span className="text-xs font-bold text-neutral-900 leading-tight">{loan.provider}</span>
                  {isSelected && <Badge variant="navy" size="sm">Selected</Badge>}
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-neutral-500">Interest Rate:</span>
                    <span className="font-extrabold text-navy-900">{loan.annualInterestRate}% p.a.</span>
                  </div>
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-neutral-500">Tenure:</span>
                    <span className="font-semibold text-neutral-800">{loan.tenureYears} Years</span>
                  </div>
                  <div className="flex items-baseline justify-between text-xs border-t border-neutral-200 pt-1.5">
                    <span className="text-neutral-700 font-bold">Monthly EMI:</span>
                    <span className="font-extrabold text-success-700 text-sm">
                      {formatCurrency(evalResult.monthlyEMI)}/mo
                    </span>
                  </div>
                </div>

                <div className="bg-white/80 p-2 rounded-lg border border-neutral-200/80 text-[11px] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Total Repayment:</span>
                    <span className="font-medium text-neutral-800">{formatCurrency(evalResult.totalRepayment)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Total Interest:</span>
                    <span className="font-medium text-amber-800">{formatCurrency(evalResult.totalInterest)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scholarships & Funding Options Panel */}
      <Card id="finance-scholarships-panel">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-navy-700" />
                Potentially Applicable Scholarships
              </h3>
              <p className="text-xs text-neutral-500">
                Toggle scholarships to automatically update your Funding Stack
              </p>
            </div>
            <Badge variant="outline" size="sm">
              {selectedScholarships.length} Selected
            </Badge>
          </div>

          <div className="space-y-3">
            {scholarships.map((sch) => {
              const isSelected = selectedScholarshipIds.includes(sch.id);
              return (
                <div
                  key={sch.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isSelected
                      ? 'bg-success-50/40 border-success-300 shadow-2xs'
                      : 'bg-neutral-50/50 border-neutral-200'
                  }`}
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-neutral-900">{sch.name}</h4>
                      <Badge variant="success" size="sm">
                        + {formatCurrency(sch.amount || sch.amountINR || 0)}
                      </Badge>
                      <Badge variant="outline" size="sm">
                        Potentially Applicable
                      </Badge>
                    </div>
                    <p className="text-xs text-neutral-500">Provider: {sch.provider}</p>
                    <div className="flex flex-wrap gap-2 text-[11px] text-neutral-600 pt-1">
                      {sch.eligibility.map((e, idx) => (
                        <span key={idx} className="bg-white px-2 py-0.5 rounded border border-neutral-200">
                          {e}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button
                    variant={isSelected ? 'secondary' : 'outline'}
                    size="sm"
                    className={isSelected ? 'bg-success-100 text-success-900 border-success-300 font-semibold' : ''}
                    onClick={() => toggleScholarship(sch.id)}
                  >
                    {isSelected ? '✓ Included in Stack' : '+ Add to Funding'}
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Expandable Financial Assumptions & Evidence Section */}
      <Card className="border-neutral-200 bg-neutral-50/70">
        <CardContent className="py-4">
          <button
            onClick={() => setShowAssumptions(!showAssumptions)}
            className="w-full flex items-center justify-between text-xs font-bold text-neutral-800 uppercase tracking-wider"
          >
            <span className="flex items-center gap-2">
              <Info className="h-4 w-4 text-navy-700" />
              Financial Assumptions & Evidence Model
            </span>
            {showAssumptions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {showAssumptions && (
            <div className="mt-4 pt-4 border-t border-neutral-200 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-neutral-600">
              <div className="space-y-2 bg-white p-3.5 rounded-xl border border-neutral-200">
                <h4 className="font-bold text-navy-900">Cost & Fee Assumptions:</h4>
                <ul className="space-y-1 list-disc list-inside text-neutral-600">
                  {activeInstitution.assumptions.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                  <li>Hostel & living cost based on prototype regional averages.</li>
                </ul>
              </div>

              <div className="space-y-2 bg-white p-3.5 rounded-xl border border-neutral-200">
                <h4 className="font-bold text-navy-900">Loan & Repayment Assumptions:</h4>
                <ul className="space-y-1 list-disc list-inside text-neutral-600">
                  {selectedLoan.assumptions.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                  <li>Interest rate is illustrative based on current bank circulars.</li>
                </ul>
              </div>

              <div className="md:col-span-2 bg-amber-50/60 p-3 rounded-lg border border-amber-200 text-amber-900 text-xs">
                📌 <strong>Evidence Status:</strong> Data marked as <em>Prototype estimate</em>.
                Always verify official fee structures directly with university administration before making financial commitments.
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
