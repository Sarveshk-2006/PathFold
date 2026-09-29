import type { Institution } from '@/types';

export interface InstitutionComparisonRow {
  fieldLabel: string;
  category: 'overview' | 'financial' | 'admission' | 'trust';
  values: Record<string, string | number>;
}

export interface InstitutionComparisonResult {
  selectedInstitutions: Institution[];
  rows: InstitutionComparisonRow[];
  costComparison: {
    institutionId: string;
    name: string;
    tuitionAnnual: number;
    hostelAnnual: number;
    livingAnnual: number;
    otherAnnual: number;
    total4YearCost: number;
    fundingGapVsBudget: number;
  }[];
}

// ─── 1. Calculate Total Derived Cost for Institution ──────────────
export function calculateInstitutionTotalCost(institution: Institution): number {
  const annualTotal =
    institution.tuitionFeeAnnual +
    institution.hostelCostAnnual +
    institution.livingCostAnnual +
    institution.otherMandatoryCostsAnnual;
  return annualTotal * institution.durationYears;
}

// ─── 2. Compare Institutions Side-by-Side ─────────────────────────
export function compareInstitutions(
  allInstitutions: Institution[],
  selectedIds: string[],
  familyBudget = 600000
): InstitutionComparisonResult {
  const selectedInstitutions = allInstitutions.filter((inst) => selectedIds.includes(inst.id));

  const costComparison = selectedInstitutions.map((inst) => {
    const total4YearCost = calculateInstitutionTotalCost(inst);
    const gap = Math.max(0, total4YearCost - familyBudget);

    return {
      institutionId: inst.id,
      name: inst.shortName || inst.name,
      tuitionAnnual: inst.tuitionFeeAnnual,
      hostelAnnual: inst.hostelCostAnnual,
      livingAnnual: inst.livingCostAnnual,
      otherAnnual: inst.otherMandatoryCostsAnnual,
      total4YearCost,
      fundingGapVsBudget: gap,
    };
  });

  // Construct tabular comparison rows
  const rows: InstitutionComparisonRow[] = [
    {
      fieldLabel: 'Institution Name',
      category: 'overview',
      values: Object.fromEntries(selectedInstitutions.map((i) => [i.id, i.name])),
    },
    {
      fieldLabel: 'Category / Type',
      category: 'overview',
      values: Object.fromEntries(
        selectedInstitutions.map((i) => [
          i.id,
          i.type === 'public_technical'
            ? 'Public Technical (IIT/NIT)'
            : i.type === 'state'
            ? 'State Govt Autonomous'
            : i.type === 'private'
            ? 'Private University'
            : 'Deemed University',
        ])
      ),
    },
    {
      fieldLabel: 'Location',
      category: 'overview',
      values: Object.fromEntries(selectedInstitutions.map((i) => [i.id, `${i.city}, ${i.state}`])),
    },
    {
      fieldLabel: 'Programme & Duration',
      category: 'overview',
      values: Object.fromEntries(
        selectedInstitutions.map((i) => [i.id, `${i.programme} (${i.durationYears} Years)`])
      ),
    },
    {
      fieldLabel: 'Tuition Fee (Annual)',
      category: 'financial',
      values: Object.fromEntries(
        selectedInstitutions.map((i) => [i.id, `₹${(i.tuitionFeeAnnual / 100000).toFixed(2)} Lakh / yr`])
      ),
    },
    {
      fieldLabel: 'Hostel & Living (Annual)',
      category: 'financial',
      values: Object.fromEntries(
        selectedInstitutions.map((i) => [
          i.id,
          `₹${((i.hostelCostAnnual + i.livingCostAnnual) / 100000).toFixed(2)} Lakh / yr`,
        ])
      ),
    },
    {
      fieldLabel: 'Total Estimated Degree Cost',
      category: 'financial',
      values: Object.fromEntries(
        selectedInstitutions.map((i) => [
          i.id,
          `₹${(calculateInstitutionTotalCost(i) / 100000).toFixed(2)} Lakh`,
        ])
      ),
    },
    {
      fieldLabel: 'Funding Gap (vs ₹6L Budget)',
      category: 'financial',
      values: Object.fromEntries(
        selectedInstitutions.map((i) => {
          const total = calculateInstitutionTotalCost(i);
          const gap = total - familyBudget;
          return [
            i.id,
            gap <= 0
              ? '✅ Fits Family Budget'
              : `⚠️ Gap: ₹${(gap / 100000).toFixed(2)} Lakh`,
          ];
        })
      ),
    },
    {
      fieldLabel: 'Entrance Exam Gate',
      category: 'admission',
      values: Object.fromEntries(selectedInstitutions.map((i) => [i.id, i.entranceExam])),
    },
    {
      fieldLabel: 'Admission Requirements',
      category: 'admission',
      values: Object.fromEntries(
        selectedInstitutions.map((i) => [i.id, i.admissionRequirements.join('; ')])
      ),
    },
    {
      fieldLabel: 'Scholarships Available',
      category: 'admission',
      values: Object.fromEntries(
        selectedInstitutions.map((i) => [i.id, i.scholarships.join(', ') || 'Standard Govt Merit'])
      ),
    },
    {
      fieldLabel: 'Data Evidence Status',
      category: 'trust',
      values: Object.fromEntries(
        selectedInstitutions.map((i) => [
          i.id,
          `${i.evidence.confidence === 'prototype' ? 'Prototype estimate' : 'Verified'} (${i.evidence.sourceName})`,
        ])
      ),
    },
  ];

  return {
    selectedInstitutions,
    rows,
    costComparison,
  };
}
