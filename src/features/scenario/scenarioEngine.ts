import type { StudentProfile, Pathway, Institution } from '../../types/index';
import { allPathways, colleges } from '../../data/index';
import { evaluatePathwayEligibility } from '../../utils/evaluationEngine';
import { calculateInstitutionTotalCost } from '../compare/comparisonEngine';
import { calculateFundingGap, calculateFundingStack } from '../finance/financeEngine';
import type { ScenarioConfig, ScenarioResult, ScenarioChange, ScenarioAffectedItem } from './scenarioTypes';

export function evaluateScenario(
  baselineProfile: StudentProfile,
  config: ScenarioConfig,
  customPathways: Pathway[] = allPathways,
  customColleges: Institution[] = colleges
): ScenarioResult {
  const changes: ScenarioChange[] = [];

  // Create modified student profile based on scenario config
  const modifiedProfile: StudentProfile = {
    ...baselineProfile,
    academics: [...baselineProfile.academics],
  };

  if (config.type === 'BUDGET_REDUCTION' && config.budgetOverride !== undefined) {
    changes.push({
      field: 'Family Budget',
      previousValue: `₹${(baselineProfile.budgetINR / 100000).toFixed(1)} Lakh`,
      newValue: `₹${(config.budgetOverride / 100000).toFixed(1)} Lakh`,
      reason: 'User reduced available family education budget in simulator.',
    });
    modifiedProfile.budgetINR = config.budgetOverride;
  }

  if (config.type === 'ACADEMIC_CHANGE' && config.academicScoreOverride !== undefined) {
    changes.push({
      field: 'Board Percentage',
      previousValue: `${baselineProfile.overallPercentage}%`,
      newValue: `${config.academicScoreOverride}%`,
      reason: 'Actual board exam score differs from expected benchmark.',
    });
    modifiedProfile.overallPercentage = config.academicScoreOverride;
    // Scale subject scores proportionally for testing
    const scale = config.academicScoreOverride / baselineProfile.overallPercentage;
    modifiedProfile.academics = baselineProfile.academics.map((a) => ({
      ...a,
      score: Math.round(a.score * scale),
    }));
  }

  if (config.type === 'LOCATION_CONSTRAINT' && config.locationConstraint) {
    changes.push({
      field: 'Preferred Location',
      previousValue: baselineProfile.locationPreference || 'Anywhere in India',
      newValue: `${config.locationConstraint} only`,
      reason: 'Restricted geographic study area to home city.',
    });
    modifiedProfile.locationPreference = config.locationConstraint;
  }

  if (config.type === 'ENTRANCE_FAILURE') {
    changes.push({
      field: 'Entrance Exam Result',
      previousValue: 'Cleared / Target',
      newValue: 'Entrance Gate Missed / Rank not achieved',
      reason: 'National entrance cutoff rank was not satisfied.',
    });
  }

  if (config.type === 'NO_LOAN') {
    changes.push({
      field: 'Education Loan Option',
      previousValue: 'Allowed',
      newValue: 'Disabled / Not Available',
      reason: 'Student or family opts out of debt funding.',
    });
  }

  if (config.type === 'PATHWAY_UNAVAILABLE' && config.pathwayUnavailableId) {
    const unavP = customPathways.find((p) => p.id === config.pathwayUnavailableId);
    changes.push({
      field: 'Primary Pathway Availability',
      previousValue: unavP ? unavP.name : 'Available',
      newValue: 'Unavailable / Closed',
      reason: 'Primary target pathway capacity full or seat unavailable.',
    });
  }

  // Evaluate baseline vs modified pathways using pure evaluation engine
  const removedOptions: ScenarioAffectedItem[] = [];
  const affectedOptions: ScenarioAffectedItem[] = [];
  const stillOpenOptions: ScenarioAffectedItem[] = [];
  const newlyConditional: ScenarioAffectedItem[] = [];

  // 1. Evaluate Pathways
  customPathways.forEach((pathway) => {
    const baseEval = evaluatePathwayEligibility(baselineProfile, pathway);
    const modEval = evaluatePathwayEligibility(modifiedProfile, pathway);

    // If pathway unavailable scenario
    if (config.type === 'PATHWAY_UNAVAILABLE' && pathway.id === config.pathwayUnavailableId) {
      removedOptions.push({
        id: pathway.id,
        name: pathway.name,
        type: 'pathway',
        reason: 'Primary pathway explicitly marked unavailable in scenario.',
      });
      return;
    }

    // If entrance failure scenario
    if (config.type === 'ENTRANCE_FAILURE' && (pathway.id.includes('btech') || pathway.id.includes('mbbs'))) {
      affectedOptions.push({
        id: pathway.id,
        name: pathway.name,
        type: 'pathway',
        reason: 'Requires entrance exam gate (JEE / NEET) which was not cleared.',
        statusChange: 'Primary Exam Gate Missed',
      });
      return;
    }

    if (baseEval.status === 'eligible' && modEval.status !== 'eligible') {
      if (modEval.status === 'conditional') {
        newlyConditional.push({
          id: pathway.id,
          name: pathway.name,
          type: 'pathway',
          reason: modEval.reason,
        });
      } else {
        removedOptions.push({
          id: pathway.id,
          name: pathway.name,
          type: 'pathway',
          reason: modEval.reason,
        });
      }
    } else if (modEval.status === 'eligible') {
      stillOpenOptions.push({
        id: pathway.id,
        name: pathway.name,
        type: 'pathway',
      });
    }
  });

  // 2. Evaluate Institutions
  customColleges.forEach((inst) => {
    const cost = calculateInstitutionTotalCost(inst);
    const baseGap = calculateFundingGap(cost, baselineProfile.budgetINR, 50000, 0, 0, 0);

    const effectiveBudget = config.type === 'NO_LOAN' ? modifiedProfile.budgetINR : modifiedProfile.budgetINR;
    const modGap = calculateFundingGap(cost, effectiveBudget, 50000, 0, 0, 0);

    // Location constraint check
    if (config.type === 'LOCATION_CONSTRAINT' && config.locationConstraint) {
      if (!inst.city.toLowerCase().includes(config.locationConstraint.toLowerCase())) {
        removedOptions.push({
          id: inst.id,
          name: inst.name,
          type: 'institution',
          reason: `Located in ${inst.city}, which is outside the location constraint (${config.locationConstraint}).`,
        });
        return;
      }
    }

    if (modGap > baseGap) {
      affectedOptions.push({
        id: inst.id,
        name: inst.name,
        type: 'institution',
        reason: `Estimated 4-year degree cost (₹${(cost / 100000).toFixed(2)}L) creates a funding gap of ₹${(modGap / 100000).toFixed(2)}L under new constraints.`,
        statusChange: `Gap increased by ₹${((modGap - baseGap) / 100000).toFixed(2)}L`,
      });
    } else if (baseGap === 0 && modGap === 0) {
      stillOpenOptions.push({
        id: inst.id,
        name: inst.name,
        type: 'institution',
      });
    }
  });

  // Financial Impact calculation using Phase 2 Finance Engine
  const basePrimaryCost = calculateInstitutionTotalCost(customColleges[1]); // COEP ₹7.12L
  const baseFinance = calculateFundingStack(basePrimaryCost, baselineProfile.budgetINR, [], 50000, 0, 0);

  const scenarioBudget = modifiedProfile.budgetINR;
  const scenarioLoan = config.type === 'NO_LOAN' ? 0 : 50000;
  const modFinance = calculateFundingStack(basePrimaryCost, scenarioBudget, [], scenarioLoan, 0, 0);

  const gapDiff = modFinance.fundingGap - baseFinance.fundingGap;
  let finExplanation = '';
  if (gapDiff > 0) {
    finExplanation = `Funding gap increased by ₹${(gapDiff / 100000).toFixed(2)} Lakh for primary target institution (${customColleges[1].shortName}).`;
  } else if (gapDiff < 0) {
    finExplanation = `Funding gap reduced by ₹${(Math.abs(gapDiff) / 100000).toFixed(2)} Lakh.`;
  } else {
    finExplanation = 'No net change in funding gap for target institution.';
  }

  // Structured Alternative Routes
  const alternativeRoutes = customPathways
    .filter((p) => p.id !== 'pathway-btech-cse' && p.id !== config.pathwayUnavailableId)
    .slice(0, 3)
    .map((p) => ({
      id: p.id,
      title: p.name,
      stream: p.stream,
      durationYears: p.durationYears,
      totalCostEstimate: p.totalCostRangeINR[0],
      description: p.description,
    }));

  const recommendations = [
    'Explore lower-cost state autonomous or government institutions.',
    'Consider B.Sc Computer Science / BCA as a resilient, affordable alternative route.',
    'Apply for merit-cum-means scholarships to bridge funding gaps without heavy debt.',
  ];

  const assumptions = [
    'Calculations reuse exact deterministic rules from Phase 1 & Phase 2 engines.',
    'Cost & fee figures based on prototype dataset estimates.',
    'Scholarship availability assumes student satisfies merit and domicile criteria.',
  ];

  return {
    scenarioId: config.id,
    name: config.name,
    type: config.type,
    changes,
    baselineProfile,
    modifiedProfile,
    removedOptions,
    affectedOptions,
    stillOpenOptions,
    newlyConditional,
    financialImpact: {
      previousGap: baseFinance.fundingGap,
      newGap: modFinance.fundingGap,
      gapDiff,
      previousLoan: 50000,
      newLoan: scenarioLoan,
      explanation: finExplanation,
    },
    alternativeRoutes,
    recommendations,
    assumptions,
    evidence: {
      sourceName: 'Deterministic Scenario Engine (Phase 3)',
      sourceType: 'Scenario Evaluation Engine',
      verifiedDate: '2025-06-30',
      confidence: 'prototype',
      notes: 'Derived from baseline profile diff recalculation.',
    },
  };
}
